import type { Card, CreateCardInput, SortBy, UpdateCardInput } from "../types/card";

const API_BASE_URL = "http://localhost:8080";

async function parseErrorOrThrow(response: Response, fallbackMessage: string): Promise<never> {
  const message = await response.text();
  throw new Error(message || `${fallbackMessage}（status: ${response.status}）`);
}

export async function fetchCards(): Promise<Card[]> {
  const response = await fetch(`${API_BASE_URL}/api/cards`);
  if (!response.ok) {
    return parseErrorOrThrow(response, "カードの取得に失敗しました");
  }
  return response.json();
}

export async function createCard(input: CreateCardInput): Promise<Card> {
  const response = await fetch(`${API_BASE_URL}/api/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    return parseErrorOrThrow(response, "カードの登録に失敗しました");
  }
  return response.json();
}

export async function updateCard(id: number, input: UpdateCardInput): Promise<Card> {
  const response = await fetch(`${API_BASE_URL}/api/cards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    return parseErrorOrThrow(response, "カードの更新に失敗しました");
  }
  return response.json();
}

export async function moveCard(
  id: number,
  input: { listId: number; beforeCardId: number | null },
): Promise<Card[]> {
  const response = await fetch(`${API_BASE_URL}/api/cards/${id}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    return parseErrorOrThrow(response, "カードの移動に失敗しました");
  }
  return response.json();
}

export async function sortCards(listId: number, sortBy: SortBy): Promise<Card[]> {
  const response = await fetch(`${API_BASE_URL}/api/lists/${listId}/cards/sort`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sortBy }),
  });
  if (!response.ok) {
    return parseErrorOrThrow(response, "カードの並び替えに失敗しました");
  }
  return response.json();
}

export async function deleteCard(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/cards/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    return parseErrorOrThrow(response, "カードの削除に失敗しました");
  }
}
