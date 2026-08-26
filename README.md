# Trello風タスク管理アプリ

プログラミングスクールの課題として開発している、個人利用向けのTrello風タスク管理アプリ。「リスト × カード」形式でタスクを管理する。学習目的として、要件定義からの開発の流れ、フロントエンド（React + TypeScript）とバックエンド（Java + Spring Boot）を分離した構成、データベース（PostgreSQL）を用いたデータ永続化を実践している。

詳しい背景・要件は [要件定義.md](./要件定義.md) を参照。

## ドキュメント

| ドキュメント | 内容 |
|---|---|
| [要件定義.md](./要件定義.md) | プロジェクト全体の背景・目的・スコープ・受け入れ基準など |
| [docs/機能要件.md](./docs/機能要件.md) | カードの各機能の詳細仕様 |
| [docs/画面設計.md](./docs/画面設計.md) | 画面レイアウト・UI要素の詳細仕様 |
| [docs/データベース設計.md](./docs/データベース設計.md) | ER図・テーブル定義 |
| [docs/技術スタック.md](./docs/技術スタック.md) | 使用技術・バージョン |
| [backend/README.md](./backend/README.md) | バックエンドのセットアップ・API仕様 |
| [frontend/README.md](./frontend/README.md) | フロントエンドのセットアップ・実装状況 |
| [CLAUDE.md](./CLAUDE.md) | Git/GitHub運用ルール |

## 構成

```
trello-clone/
├── backend/    バックエンド（Java + Spring Boot）
├── frontend/   フロントエンド（TypeScript + React + Tailwind CSS）
├── prototype/  画面イメージ確認用の簡易プロトタイプ（HTML/CSS/JS、DB接続なし）
├── docs/       要件定義の詳細ドキュメント群
└── docker-compose.yml   PostgreSQL起動用
```

## 技術スタック（詳細は [docs/技術スタック.md](./docs/技術スタック.md)）

- フロントエンド：TypeScript + React（Vite） + Tailwind CSS
- バックエンド：Java + Spring Boot（Gradle, Spring Data JPA）
- データベース：PostgreSQL（Docker）

## クイックスタート

PostgreSQL・バックエンド・フロントエンドの3つを起動する。詳細は各READMEを参照。

```bash
# 1. PostgreSQLを起動する
docker compose up -d

# 2. バックエンドを起動する（別ターミナル）
cd backend
./gradlew bootRun

# 3. フロントエンドを起動する（別ターミナル）
cd frontend
npm install
npm run dev
```

起動後、`http://localhost:5173` をブラウザで開く。

## 現在の実装状況

- バックエンド：カード取得API（READ）のみ実装済み（[backend/README.md](./backend/README.md) 参照）
- フロントエンド：取得したカードをボード画面（未着手・進行中・完了の3リスト）に表示する機能のみ実装済み（[frontend/README.md](./frontend/README.md) 参照）
- カードの新規作成・編集・削除・ドラッグ＆ドロップによる並び替えは、[docs/機能要件.md](./docs/機能要件.md) に定義済みだが未実装（対応するバックエンドAPIから順次実装予定）
