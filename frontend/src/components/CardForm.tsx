import { useState } from "react";
import { createCard, updateCard } from "../api/cards";
import type { Card, Priority } from "../types/card";

const PRIORITIES: Priority[] = ["高", "中", "低"];

type CardFormProps =
  | {
      mode: "create";
      listId: number;
      onSaved: () => void;
      onCancel: () => void;
    }
  | {
      mode: "edit";
      card: Card;
      onSaved: () => void;
      onCancel: () => void;
    };

export function CardForm(props: CardFormProps) {
  const initial = props.mode === "edit" ? props.card : null;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "中");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [titleError, setTitleError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError(true);
      return;
    }

    setTitleError(false);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const input = {
        title: trimmedTitle,
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
      };

      if (props.mode === "create") {
        await createCard({ listId: props.listId, ...input });
      } else {
        await updateCard(props.card.id, input);
      }
      props.onSaved();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-md bg-white p-2.5 shadow-sm">
      <input
        type="text"
        placeholder="タスク名を入力"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`rounded border px-2 py-1 text-sm ${
          titleError ? "border-red-600 bg-red-50" : "border-gray-300"
        }`}
      />
      {titleError && (
        <p className="text-xs text-red-600">タイトルを入力してください</p>
      )}

      <textarea
        placeholder="詳細（任意）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-[3rem] resize-y rounded border border-gray-300 px-2 py-1 text-sm"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dueDate ?? ""}
        onChange={(e) => setDueDate(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />

      {submitError && <p className="text-xs text-red-600">{submitError}</p>}

      <div className="mt-1 flex gap-1.5">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 rounded bg-blue-900 py-1 text-sm text-white disabled:opacity-50"
        >
          {props.mode === "create" ? "追加" : "保存"}
        </button>
        <button
          type="button"
          onClick={props.onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded bg-gray-200 py-1 text-sm text-gray-800 disabled:opacity-50"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
