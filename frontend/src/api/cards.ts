import type { Card } from "../types/card";

const API_BASE_URL = "http://localhost:8080";

export async function fetchCards(): Promise<Card[]> {
  const response = await fetch(`${API_BASE_URL}/api/cards`);
  if (!response.ok) {
    throw new Error(`カードの取得に失敗しました（status: ${response.status}）`);
  }
  return response.json();
}
