export interface TaskList {
  id: number;
  name: string;
}

// data.sqlの初期データ（未着手=1, 進行中=2, 完了=3）に合わせた固定値。
// リスト一覧取得APIが実装されたら、そちらから取得するように置き換える。
export const TASK_LISTS: TaskList[] = [
  { id: 1, name: "未着手" },
  { id: 2, name: "進行中" },
  { id: 3, name: "完了" },
];
