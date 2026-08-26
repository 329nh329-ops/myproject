import { useState } from "react";
import type { Card } from "../types/card";
import type { TaskList } from "../constants/lists";
import { CardItem } from "./CardItem";
import { CardForm } from "./CardForm";

export function BoardColumn({
  list,
  cards,
  onCardCreated,
}: {
  list: TaskList;
  cards: Card[];
  onCardCreated: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <section className="w-72 shrink-0 rounded-lg bg-gray-200 p-3">
      <div className="mb-2 px-1 font-bold">
        {list.name} ({cards.length}件)
      </div>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {isAdding ? (
        <div className="mt-2">
          <CardForm
            listId={list.id}
            onCreated={() => {
              setIsAdding(false);
              onCardCreated();
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
