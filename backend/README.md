# backend

Trello風タスク管理アプリのバックエンド（Spring Boot）。

全体の要件・設計については以下も参照。

- [要件定義.md](../要件定義.md)
- [docs/機能要件.md](../docs/機能要件.md)
- [docs/データベース設計.md](../docs/データベース設計.md)
- [docs/技術スタック.md](../docs/技術スタック.md)

## 技術構成
- Java 21（LTS）
- Spring Boot 4.1系（Gradle, Spring Data JPA）
- データベース：PostgreSQL 16系（本番用。Docker上で起動する）

## ディレクトリ構成

```
backend/src/main/java/com/example/trelloclone/
├── TrelloCloneApplication.java   起動クラス
├── HealthController.java         疎通確認用（/api/health）
├── config/
│   └── WebConfig.java            CORS設定（フロントエンドのVite開発サーバーからのアクセスを許可）
├── controller/
│   └── CardController.java       カードAPI
├── service/
│   └── CardService.java          カードのビジネスロジック
├── repository/
│   ├── TaskListRepository.java   LISTSテーブルへのアクセス
│   └── CardRepository.java       CARDSテーブルへのアクセス
├── entity/
│   ├── TaskList.java             LISTSテーブルに対応するエンティティ
│   └── Card.java                 CARDSテーブルに対応するエンティティ
└── dto/
    └── CardResponse.java         カードAPIのレスポンス形式
```

## データベース構成

[docs/データベース設計.md](../docs/データベース設計.md) のER図に基づく2テーブル構成。

- `lists`：リストマスタ（未着手・進行中・完了の3件固定）
- `cards`：カード（`list_id`で`lists`と紐付く）

テーブルはアプリ起動時にHibernate（`spring.jpa.hibernate.ddl-auto=update`）が自動生成する。手動でのマイグレーションは不要。

## 起動方法

### 通常起動（PostgreSQL接続）
リポジトリ直下の `docker-compose.yml` でPostgreSQLをDocker上に用意している。`src/main/resources/application.properties` の接続情報（DB名・ユーザー・パスワード）と一致させてあるため、以下の手順で起動できる。

```
# 1. リポジトリ直下でPostgreSQLコンテナを起動する
docker compose up -d

# 2. コンテナが起動完了（healthy）になっていることを確認する
docker compose ps

# 3. backendディレクトリでSpring Bootを起動する（Java 21を使用する）
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
./gradlew bootRun
```

PostgreSQLコンテナを停止する場合は `docker compose down` を実行する（データは名前付きボリュームに残る）。データも含めて完全にリセットしたい場合は `docker compose down -v` を実行する。

起動時に `src/main/resources/data.sql` でテストデータ（LISTS 3件、CARDS 4件）が自動投入される。**起動のたびに既存データが洗い替えされる**ため、開発中に登録したデータは次回起動時に消える点に注意する。

### PostgreSQLがまだない場合の動作確認
組み込みDB（H2）を使った起動確認用のプロファイルを用意している。データはメモリ上にのみ保持され、あくまで動作確認用。

```
./gradlew bootRun --args='--spring.profiles.active=local-check'
```

起動後、以下で疎通確認できる（local-checkプロファイルはポート8081で起動する）。

```
curl http://localhost:8081/api/health
# => {"status":"ok"}
```

通常起動時（PostgreSQL接続時）はポート8080で起動する。

```
curl http://localhost:8080/api/health
```

## API仕様

現時点ではカードの参照系（READ）・新規作成（CREATE）・更新（UPDATE）・削除（DELETE）を実装している。

### カード一覧取得

```
GET /api/cards
```

全カードを取得する。

```
GET /api/cards?listId={listId}
```

`listId` を指定すると、そのリストに属するカードのみを取得する（`listId`: 1=未着手, 2=進行中, 3=完了）。

**レスポンス例**
```json
[
  {
    "id": 1,
    "listId": 1,
    "title": "要件定義書を読み返す",
    "description": "",
    "priority": "高",
    "dueDate": "2026-09-01",
    "displayOrder": 0,
    "createdAt": "2026-08-25T14:01:25.070021",
    "updatedAt": "2026-08-25T14:01:25.070021"
  }
]
```

### カード単体取得

```
GET /api/cards/{id}
```

指定したIDのカードを1件取得する。存在しないIDを指定した場合は404を返す。

### カード新規作成

```
POST /api/cards
Content-Type: application/json
```

**リクエストボディ例**
```json
{
  "listId": 1,
  "title": "新しいタスク",
  "description": "詳細（任意）",
  "priority": "中",
  "dueDate": "2026-10-01"
}
```

- `listId`, `title`, `priority` は必須。`title`が空、または存在しない`listId`を指定した場合はエラーを返す（`title`空の場合400、`listId`不正の場合404）
- `description`, `dueDate` は任意（省略時はそれぞれ空文字・nullを送る）
- `displayOrder`（リスト内の並び順）はサーバー側で自動採番される（対象リストの末尾に追加）
- 成功時は201 Createdとともに、採番されたIDを含むカード情報を返す

### カード内容の更新

```
PUT /api/cards/{id}
Content-Type: application/json
```

**リクエストボディ例**
```json
{
  "title": "更新後のタイトル",
  "description": "詳細（任意）",
  "priority": "低",
  "dueDate": "2026-11-01"
}
```

- `title`, `priority` は必須。`title`が空の場合は400を返す
- 成功時は200 OKとともに、更新後のカード情報（`updatedAt`も更新済み）を返す
- 所属リスト（`listId`）や並び順（`displayOrder`）はこのAPIでは変更されない（変更する場合は下記の移動APIを使う）

### カードの移動・並び替え（ドラッグ＆ドロップ用）

```
PATCH /api/cards/{id}/move
Content-Type: application/json
```

**リクエストボディ例**
```json
{
  "listId": 2,
  "beforeCardId": 5
}
```

- `listId`：移動先のリストID（同一リスト内での並び替えの場合は現在と同じIDを指定する）
- `beforeCardId`：このIDのカードの直前に挿入する。リストの末尾に置く場合は`null`を指定する
- 対象カードの`listId`・`displayOrder`を更新するとともに、移動先リストに残る他カードの`displayOrder`も振り直される
- 成功時は200 OKとともに、**移動先リストに属する全カード**（更新後の`displayOrder`を反映したもの）を配列で返す

### カードの一括並び替え（優先度順・期限順ボタン用）

```
PATCH /api/lists/{listId}/cards/sort
Content-Type: application/json
```

**リクエストボディ例**
```json
{
  "sortBy": "priority"
}
```

- `sortBy`：`"priority"`（優先度: 高→中→低の順）または`"due"`（期限の早い順。未設定は末尾）
- 指定したリスト内の全カードの`displayOrder`を、ソート結果の順に振り直す
- 成功時は200 OKとともに、**そのリストに属する全カード**（更新後の`displayOrder`を反映したもの）を配列で返す

### カードの削除

```
DELETE /api/cards/{id}
```

- 論理削除ではなく**物理削除**（データベースの行を完全に削除する）
- 削除後、同一リストに残ったカードの`displayOrder`を`0, 1, 2...`に詰め直す
- 成功時は204 No Contentを返す。存在しないIDを指定した場合は404を返す

### 動作確認コマンド

```
# 全カード取得
curl http://localhost:8080/api/cards

# ID指定で1件取得
curl http://localhost:8080/api/cards/1

# カード新規作成
curl -X POST http://localhost:8080/api/cards \
  -H "Content-Type: application/json" \
  -d '{"listId":1,"title":"新しいタスク","description":"","priority":"中","dueDate":null}'

# リスト（ステータス）別取得
curl "http://localhost:8080/api/cards?listId=1"

# カード内容の更新
curl -X PUT http://localhost:8080/api/cards/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"更新後のタイトル","description":"","priority":"低","dueDate":null}'

# カードの移動（リスト2の末尾へ）
curl -X PATCH http://localhost:8080/api/cards/1/move \
  -H "Content-Type: application/json" \
  -d '{"listId":2,"beforeCardId":null}'

# リスト内の一括並び替え（優先度順）
curl -X PATCH http://localhost:8080/api/lists/1/cards/sort \
  -H "Content-Type: application/json" \
  -d '{"sortBy":"priority"}'

# カードの削除
curl -X DELETE http://localhost:8080/api/cards/1
```

## CORS設定
フロントエンド（Vite開発サーバー、`http://localhost:5173`）からのアクセスを許可するCORS設定を `config/WebConfig.java` に追加している。現時点ではGET, POST, PUT, PATCH, DELETEメソッドを許可している。
