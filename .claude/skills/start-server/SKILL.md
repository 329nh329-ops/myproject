---
name: start-server
description: Trello風タスク管理アプリ（このリポジトリ）のPostgreSQL・バックエンド（Spring Boot）・フロントエンド（Vite）をローカルで起動/停止する。ユーザーが「サーバーを起動して」「アプリを動かして」「ローカルで立ち上げて」「開発環境を起動して」「動作確認したい」のように言ったとき、あるいは「サーバーを止めて」「停止して」「片付けて」のように言ったときは、このプロジェクト内では必ずこのスキルを使う。バックエンドだけ、フロントエンドだけを起動したい場合にも使う。
---

# サーバー起動スキル

このリポジトリ（trello-clone）は3つのプロセスで構成されている。

| プロセス | 役割 | ポート |
|---|---|---|
| PostgreSQL（Docker） | データベース | 5432 |
| バックエンド（Spring Boot） | API | 8080 |
| フロントエンド（Vite） | 画面 | 5173 |

通常は3つとも起動して初めて画面からAPIのデータが見られる状態になる。ユーザーが単に「起動して」「動かして」と言った場合はフルスタック（3つとも）起動する。「バックエンドだけ」「APIだけ」のように言われた場合はPostgreSQL＋バックエンドのみ、「フロントエンドだけ」と言われた場合はフロントエンドのみを起動すればよい（ただしフロントエンド単体では画面にデータは出ないため、その旨を一言伝える）。

## 起動手順（フルスタック）

リポジトリのルートディレクトリ（`docker-compose.yml`がある場所）を基準に実行する。

1. **PostgreSQLをDockerで起動する**
   ```
   docker compose up -d
   ```
   起動直後はヘルスチェック中のことがあるため、以下で`healthy`になるまで待つ。
   ```
   docker compose ps
   ```

2. **バックエンド（Spring Boot）を起動する**

   JavaのバージョンをJava 21に固定する必要がある（他バージョンだとビルド・起動に失敗することがある）。
   ```
   cd backend
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   ./gradlew bootRun
   ```
   起動時に`data.sql`でテストデータ（リスト3件・カード数件）が毎回洗い替えされる。ログに `Started TrelloCloneApplication` が出れば起動完了。バックグラウンドで実行し、ログをファイルに逃がしておくと以降の作業がしやすい。

3. **フロントエンド（Vite）を起動する**
   ```
   cd frontend
   npm run dev
   ```
   `node_modules`が無ければ先に`npm install`を実行する。ログに `ready in` と `Local: http://localhost:5173/` が出れば起動完了。

4. ユーザーに `http://localhost:5173` を伝える（可能ならブラウザで開く）。

## 起動確認

起動が完了したら、画面を開く前に以下でAPIが実際にデータを返しているかを確認しておくと確実。

```
curl http://localhost:8080/api/cards
```

カードのJSON配列が返ってくればバックエンドは正常。何も返らない・接続エラーになる場合は、PostgreSQLコンテナが`healthy`になっているか、Spring Bootのログにエラーが出ていないかを確認する。

## PostgreSQLがまだ使えない場合

Dockerが使えない、あるいはPostgreSQLを起動したくない場合は、バックエンド単体をH2組み込みDBで動作確認できる。ただしデータは保存されず、フロントエンドから見えるデータもテスト用の最小限のものになる。

```
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
./gradlew bootRun --args='--spring.profiles.active=local-check'
```
この場合はポート8081で起動する（`curl http://localhost:8081/api/health`で確認）。

## 停止手順

1. フロントエンド（Vite）のプロセスを終了する
2. バックエンド（Spring Boot）のプロセスを終了する
3. PostgreSQLコンテナを停止する
   ```
   docker compose down
   ```
   データは名前付きボリュームに残るため、次回`docker compose up -d`すれば復元される。テストデータも含めて完全にリセットしたい場合のみ、ボリュームごと削除する。
   ```
   docker compose down -v
   ```

## ポートが使用中の場合

8080番や5173番が既に使われている場合、別プロセスが起動したままになっている可能性がある。以下でプロセスを特定してから、必要に応じて終了する。
```
lsof -ti:8080
lsof -ti:5173
```
