import type { Card, Priority } from "../types/card";

const PRIORITY_CLASSES: Record<Priority, string> = {
  高: "text-red-600",
  中: "text-yellow-700",
  低: "text-green-700",
};

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

export function CardItem({ card }: { card: Card }) {
  return (
    <div className="rounded-md bg-white p-2.5 shadow-sm">
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
