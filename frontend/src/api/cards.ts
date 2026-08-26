import type { Card, CreateCardInput } from "../types/card";

const API_BASE_URL = "http://localhost:8080";

export async function fetchCards(): Promise<Card[]> {
  const response = await fetch(`${API_BASE_URL}/api/cards`);
  if (!response.ok) {
    throw new Error(`カードの取得に失敗しました（status: ${response.status}）`);
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
    const message = await response.text();
    throw new Error(message || `カードの登録に失敗しました（status: ${response.status}）`);
  }
  return response.json();
}
