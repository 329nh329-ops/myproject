import { useEffect, useState } from "react";
import { fetchCards } from "../api/cards";
import { TASK_LISTS } from "../constants/lists";
import type { Card } from "../types/card";
import { BoardColumn } from "./BoardColumn";

export function Board() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards()
      .then(setCards)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p className="p-6">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">エラーが発生しました: {error}</p>;
  }

  return (
    <main className="flex items-start gap-4 p-6">
      {TASK_LISTS.map((list) => (
        <BoardColumn
          key={list.id}
          list={list}
          cards={cards.filter((card) => card.listId === list.id)}
        />
      ))}
    </main>
  );
}
