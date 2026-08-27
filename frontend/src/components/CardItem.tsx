import { useState } from "react";
import type { Card, Priority } from "../types/card";
import { CardForm } from "./CardForm";

const PRIORITY_CLASSES: Record<Priority, string> = {
  高: "text-red-600",
  中: "text-yellow-700",
  低: "text-green-700",
};

type DropPosition = "before" | "after";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${y}/${m}/${d}`;
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr < today;
}

export function CardItem({
  card,
  isEditing,
  onStartEdit,
  onSaved,
  onCancelEdit,
  onDragStart,
  onDragEnd,
  onDropAt,
  isDragging,
}: {
  card: Card;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaved: () => void;
  onCancelEdit: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropAt: (position: DropPosition) => void;
  isDragging: boolean;
}) {
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

  if (isEditing) {
    return <CardForm mode="edit" card={card} onSaved={onSaved} onCancel={onCancelEdit} />;
  }

  function positionFromPointer(e: React.DragEvent<HTMLDivElement>): DropPosition {
    const rect = e.currentTarget.getBoundingClientRect();
    const isUpperHalf = e.clientY < rect.top + rect.height / 2;
    return isUpperHalf ? "before" : "after";
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart();
      }}
      onDragEnd={() => {
        setDropPosition(null);
        onDragEnd();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropPosition(positionFromPointer(e));
      }}
      onDragLeave={() => setDropPosition(null)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropAt(positionFromPointer(e));
        setDropPosition(null);
      }}
      onClick={onStartEdit}
      className={`cursor-pointer rounded-md bg-white p-2.5 shadow-sm ${
        isDragging ? "opacity-50" : ""
      } ${dropPosition === "before" ? "border-t-2 border-blue-500" : ""} ${
        dropPosition === "after" ? "border-b-2 border-blue-500" : ""
      }`}
    >
      <div className="mb-1.5 truncate font-bold">{card.title}</div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className={`font-bold ${PRIORITY_CLASSES[card.priority]}`}>
          優先度: {card.priority}
        </span>
        <span className={isOverdue(card.dueDate) ? "font-bold text-red-600" : ""}>
          期限: {formatDate(card.dueDate)}
        </span>
      </div>
    </div>
  );
}
