import { useEffect, useState } from "react";
import { fetchCards, moveCard, sortCards } from "../api/cards";
import { TASK_LISTS } from "../constants/lists";
import type { Card, SortBy } from "../types/card";
import { BoardColumn } from "./BoardColumn";

export function Board() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);

  function loadCards() {
    setError(null);
    return fetchCards()
      .then(setCards)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadCards();
  }, []);

  async function handleDropBefore(listId: number, beforeCardId: number | null) {
    if (draggingCardId === null || draggingCardId === beforeCardId) {
      setDraggingCardId(null);
      return;
    }
    try {
      await moveCard(draggingCardId, { listId, beforeCardId });
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "カードの移動に失敗しました");
    } finally {
      setDraggingCardId(null);
    }
  }

  async function handleSort(listId: number, sortBy: SortBy) {
    try {
      await sortCards(listId, sortBy);
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "カードの並び替えに失敗しました");
    }
  }

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
          cards={cards
            .filter((card) => card.listId === list.id)
            .sort((a, b) => a.displayOrder - b.displayOrder)}
          editingCardId={editingCardId}
          draggingCardId={draggingCardId}
          onCardSaved={async () => {
            setEditingCardId(null);
            await loadCards();
          }}
          onStartEdit={setEditingCardId}
          onCancelEdit={() => setEditingCardId(null)}
          onDragStart={setDraggingCardId}
          onDragEnd={() => setDraggingCardId(null)}
          onDropBefore={handleDropBefore}
          onSort={handleSort}
        />
      ))}
    </main>
  );
}
