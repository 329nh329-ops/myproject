import { useState } from "react";
import type { Card, SortBy } from "../types/card";
import type { TaskList } from "../constants/lists";
import { CardItem } from "./CardItem";
import { CardForm } from "./CardForm";

export function BoardColumn({
  list,
  cards,
  editingCardId,
  draggingCardId,
  onCardSaved,
  onStartEdit,
  onCancelEdit,
  onDragStart,
  onDragEnd,
  onDropBefore,
  onSort,
}: {
  list: TaskList;
  cards: Card[];
  editingCardId: number | null;
  draggingCardId: number | null;
  onCardSaved: () => void;
  onStartEdit: (cardId: number) => void;
  onCancelEdit: () => void;
  onDragStart: (cardId: number) => void;
  onDragEnd: () => void;
  onDropBefore: (listId: number, beforeCardId: number | null) => void;
  onSort: (listId: number, sortBy: SortBy) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <section
      onDragOver={(e) => {
        if (draggingCardId === null) return;
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (draggingCardId === null) return;
        onDropBefore(list.id, null);
      }}
      className={`w-72 shrink-0 rounded-lg p-3 transition-colors ${
        isDragOver ? "bg-blue-200" : "bg-gray-200"
      }`}
    >
      <div className="mb-2 px-1 font-bold">
        {list.name} ({cards.length}件)
      </div>

      <div className="mb-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => onSort(list.id, "priority")}
          className="flex-1 rounded border border-gray-400 bg-white py-1 text-xs text-blue-900 hover:bg-gray-100"
        >
          優先度順
        </button>
        <button
          type="button"
          onClick={() => onSort(list.id, "due")}
          className="flex-1 rounded border border-gray-400 bg-white py-1 text-xs text-blue-900 hover:bg-gray-100"
        >
          期限順
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isEditing={editingCardId === card.id}
            onStartEdit={() => onStartEdit(card.id)}
            onSaved={onCardSaved}
            onCancelEdit={onCancelEdit}
            onDragStart={() => onDragStart(card.id)}
            onDragEnd={onDragEnd}
            onDropBefore={() => onDropBefore(list.id, card.id)}
            isDragging={draggingCardId === card.id}
          />
        ))}
      </div>

      {isAdding ? (
        <div className="mt-2">
          <CardForm
            mode="create"
            listId={list.id}
            onSaved={() => {
              setIsAdding(false);
              onCardSaved();
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-2 w-full rounded px-2 py-1.5 text-left text-sm text-blue-900 hover:bg-gray-300"
        >
          ＋ カードを追加
        </button>
      )}
    </section>
  );
}
