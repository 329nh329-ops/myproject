let nextId = 1;

const lists = [
  { id: "todo", name: "未着手" },
  { id: "doing", name: "進行中" },
  { id: "done", name: "完了" },
];

let cards = [
  { id: nextId++, listId: "todo", order: 0, title: "要件定義書を読み返す", description: "", priority: "高", dueDate: "2026-09-01" },
  { id: nextId++, listId: "todo", order: 1, title: "画面設計を確認する", description: "", priority: "中", dueDate: "" },
  { id: nextId++, listId: "doing", order: 0, title: "プロトタイプを作る", description: "HTML/CSS/JSのみで作成", priority: "中", dueDate: "" },
  { id: nextId++, listId: "doing", order: 1, title: "ドラッグ&ドロップを試す", description: "", priority: "低", dueDate: "2026-08-20" },
  { id: nextId++, listId: "done", order: 0, title: "要件定義をまとめる", description: "", priority: "低", dueDate: "2026-08-15" },
];

const PRIORITY_ORDER = { 高: 0, 中: 1, 低: 2 };

let editingCardId = null;
let addingListId = null;
let draggingCardId = null;

const board = document.getElementById("board");

function todayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${y}/${m}/${d}`;
}

function isOverdue(dateStr) {
  return dateStr && dateStr < todayString();
}

function reindexList(listId) {
  cards
    .filter((c) => c.listId === listId)
    .sort((a, b) => a.order - b.order)
    .forEach((c, i) => {
      c.order = i;
    });
}

function sortListBy(listId, key) {
  const listCards = cards.filter((c) => c.listId === listId);
  if (key === "priority") {
    listCards.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  } else {
    listCards.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  listCards.forEach((c, i) => {
    c.order = i;
  });
}

function moveCardBeforeTarget(draggedId, targetListId, targetCardId) {
  const dragged = cards.find((c) => c.id === draggedId);
  if (!dragged) return;

  dragged.listId = targetListId;

  const listCards = cards
    .filter((c) => c.listId === targetListId && c.id !== draggedId)
    .sort((a, b) => a.order - b.order);

  const targetIndex = targetCardId === null
    ? listCards.length
    : listCards.findIndex((c) => c.id === targetCardId);

  const insertAt = targetIndex === -1 ? listCards.length : targetIndex;
  listCards.splice(insertAt, 0, dragged);

  listCards.forEach((c, i) => {
    c.order = i;
  });
}

function render() {
  board.innerHTML = "";

  lists.forEach((list) => {
    const listCards = cards
      .filter((c) => c.listId === list.id)
      .sort((a, b) => a.order - b.order);

    const listEl = document.createElement("section");
    listEl.className = "list";
    listEl.dataset.listId = list.id;

    listEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      listEl.classList.add("drag-over");
    });
    listEl.addEventListener("dragleave", () => {
      listEl.classList.remove("drag-over");
    });
    listEl.addEventListener("drop", (e) => {
      e.preventDefault();
      listEl.classList.remove("drag-over");
      if (draggingCardId === null) return;
      // カード上へのdropはcard側でstopPropagation済みのためここには届かない。リストの空白部分へのdropは末尾に追加する。
      moveCardBeforeTarget(draggingCardId, list.id, null);
      draggingCardId = null;
      render();
    });

    const headerEl = document.createElement("div");
    headerEl.className = "list-header";
    headerEl.textContent = `${list.name} (${listCards.length}件)`;
    listEl.appendChild(headerEl);

    const sortBarEl = document.createElement("div");
    sortBarEl.className = "sort-bar";

    const sortByPriorityBtn = document.createElement("button");
    sortByPriorityBtn.className = "sort-btn";
    sortByPriorityBtn.textContent = "優先度順";
    sortByPriorityBtn.addEventListener("click", () => {
      sortListBy(list.id, "priority");
      render();
    });
    sortBarEl.appendChild(sortByPriorityBtn);

    const sortByDueBtn = document.createElement("button");
    sortByDueBtn.className = "sort-btn";
    sortByDueBtn.textContent = "期限順";
    sortByDueBtn.addEventListener("click", () => {
      sortListBy(list.id, "due");
      render();
    });
    sortBarEl.appendChild(sortByDueBtn);

    listEl.appendChild(sortBarEl);

    const cardListEl = document.createElement("div");
    cardListEl.className = "card-list";

    listCards.forEach((card) => {
      if (editingCardId === card.id) {
        cardListEl.appendChild(buildForm(card, list.id));
      } else {
        cardListEl.appendChild(buildCard(card));
      }
    });

    listEl.appendChild(cardListEl);

    if (addingListId === list.id) {
      listEl.appendChild(buildForm(null, list.id));
    } else {
      const addBtn = document.createElement("button");
      addBtn.className = "add-card-btn";
      addBtn.textContent = "＋ カードを追加";
      addBtn.addEventListener("click", () => {
        addingListId = list.id;
        editingCardId = null;
        render();
      });
      listEl.appendChild(addBtn);
    }

    board.appendChild(listEl);
  });
}

function buildCard(card) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.draggable = true;

  cardEl.addEventListener("dragstart", (e) => {
    e.stopPropagation();
    draggingCardId = card.id;
    cardEl.classList.add("dragging");
  });
  cardEl.addEventListener("dragend", () => {
    cardEl.classList.remove("dragging");
  });
  cardEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  cardEl.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggingCardId === null || draggingCardId === card.id) return;
    moveCardBeforeTarget(draggingCardId, card.listId, card.id);
    draggingCardId = null;
    render();
  });
  cardEl.addEventListener("click", () => {
    editingCardId = card.id;
    addingListId = null;
    render();
  });

  const titleEl = document.createElement("div");
  titleEl.className = "card-title";
  titleEl.textContent = card.title;
  cardEl.appendChild(titleEl);

  const metaEl = document.createElement("div");
  metaEl.className = "card-meta";

  const priorityEl = document.createElement("span");
  priorityEl.className = `priority-${card.priority}`;
  priorityEl.textContent = `優先度: ${card.priority}`;
  metaEl.appendChild(priorityEl);

  const dueEl = document.createElement("span");
  dueEl.textContent = `期限: ${formatDate(card.dueDate)}`;
  if (isOverdue(card.dueDate)) dueEl.classList.add("due-overdue");
  metaEl.appendChild(dueEl);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "card-delete-btn";
  deleteBtn.textContent = "削除";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("このカードを削除しますか？")) {
      const listId = card.listId;
      cards = cards.filter((c) => c.id !== card.id);
      reindexList(listId);
      render();
    }
  });
  metaEl.appendChild(deleteBtn);

  cardEl.appendChild(metaEl);
  return cardEl;
}

function buildForm(card, listId) {
  const isEdit = card !== null;

  const formEl = document.createElement("div");
  formEl.className = "card-form";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "タスク名を入力";
  titleInput.value = isEdit ? card.title : "";
  formEl.appendChild(titleInput);

  const errorEl = document.createElement("p");
  errorEl.className = "form-error";
  errorEl.style.display = "none";
  errorEl.textContent = "タイトルを入力してください";

  const descInput = document.createElement("textarea");
  descInput.placeholder = "詳細（任意）";
  descInput.value = isEdit ? card.description : "";
  formEl.appendChild(descInput);

  const prioritySelect = document.createElement("select");
  ["高", "中", "低"].forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    prioritySelect.appendChild(opt);
  });
  prioritySelect.value = isEdit ? card.priority : "中";
  formEl.appendChild(prioritySelect);

  const dueInput = document.createElement("input");
  dueInput.type = "date";
  dueInput.value = isEdit ? card.dueDate : "";
  formEl.appendChild(dueInput);

  formEl.appendChild(errorEl);

  const actionsEl = document.createElement("div");
  actionsEl.className = "form-actions";

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn-save";
  saveBtn.textContent = isEdit ? "保存" : "追加";
  saveBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    if (!title) {
      titleInput.classList.add("error");
      errorEl.style.display = "block";
      return;
    }

    if (isEdit) {
      card.title = title;
      card.description = descInput.value.trim();
      card.priority = prioritySelect.value;
      card.dueDate = dueInput.value;
      editingCardId = null;
    } else {
      const order = cards.filter((c) => c.listId === listId).length;
      cards.push({
        id: nextId++,
        listId,
        order,
        title,
        description: descInput.value.trim(),
        priority: prioritySelect.value,
        dueDate: dueInput.value,
      });
      addingListId = null;
    }
    render();
  });
  actionsEl.appendChild(saveBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn-cancel";
  cancelBtn.textContent = "キャンセル";
  cancelBtn.addEventListener("click", () => {
    if (isEdit) editingCardId = null;
    else addingListId = null;
    render();
  });
  actionsEl.appendChild(cancelBtn);

  formEl.appendChild(actionsEl);
  return formEl;
}

render();
