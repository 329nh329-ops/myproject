# frontend

Trello風タスク管理アプリのフロントエンド。

## 技術構成
- TypeScript
- React（Vite）
- Tailwind CSS

## 起動方法

バックエンド（PostgreSQL + Spring Boot）を先に起動しておく（[../backend/README.md](../backend/README.md) 参照）。

```
npm install
npm run dev
```

起動後、`http://localhost:5173` をブラウザで開く。

## 現在実装している機能
- `GET /api/cards` からカード一覧を取得し、未着手・進行中・完了の3リストに振り分けて表示する（READのみ）

カードの追加・編集・削除・ドラッグ＆ドロップ等の操作は、対応するバックエンドAPIの実装後に追加する。
