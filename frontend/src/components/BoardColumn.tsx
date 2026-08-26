import type { Card } from "../types/card";
import type { TaskList } from "../constants/lists";
import { CardItem } from "./CardItem";

export function BoardColumn({ list, cards }: { list: TaskList; cards: Card[] }) {
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
    </section>
  );
}
