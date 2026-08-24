# backend

Trello風タスク管理アプリのバックエンド雛形（Spring Boot）。

## 技術構成
- Java 21
- Spring Boot 4.1.1（Gradle, Spring Data JPA）
- データベース：PostgreSQL（本番用）

## 起動方法

### 通常起動（PostgreSQL接続）
リポジトリ直下の `docker-compose.yml` でPostgreSQLをDocker上に用意している。`src/main/resources/application.properties` の接続情報（DB名・ユーザー・パスワード）と一致させてあるため、以下の手順で起動できる。

```
# 1. リポジトリ直下でPostgreSQLコンテナを起動する
docker compose up -d

# 2. コンテナが起動完了（healthy）になっていることを確認する
docker compose ps

# 3. backendディレクトリでSpring Bootを起動する
cd backend
./gradlew bootRun
```

PostgreSQLコンテナを停止する場合は `docker compose down` を実行する（データは名前付きボリュームに残る）。データも含めて完全にリセットしたい場合は `docker compose down -v` を実行する。

### PostgreSQLがまだない場合の動作確認
組み込みDB（H2）を使った起動確認用のプロファイルを用意している。データは保存されず、あくまで雛形が正しく起動するかの確認用。

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

## カード取得API（READ）

起動時に `data.sql` でテストデータ（LISTS 3件、CARDS 4件）が自動投入される（起動のたびに洗い替えされる）。

```
# 全カード取得
curl http://localhost:8080/api/cards

# ID指定で1件取得
curl http://localhost:8080/api/cards/1

# リスト（ステータス）別取得
curl "http://localhost:8080/api/cards?listId=1"
```
