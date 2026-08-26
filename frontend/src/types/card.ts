export type Priority = "高" | "中" | "低";

export interface Card {
  id: number;
  listId: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardInput {
  listId: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
}

export interface UpdateCardInput {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
}

export type SortBy = "priority" | "due";
