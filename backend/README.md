# backend

Trello風タスク管理アプリのバックエンド雛形（Spring Boot）。

## 技術構成
- Java 21
- Spring Boot 4.1.1（Gradle, Spring Data JPA）
- データベース：PostgreSQL（本番用）

## 起動方法

### 通常起動（PostgreSQL接続）
`src/main/resources/application.properties` の接続情報（DB名・ユーザー・パスワード）に合わせてPostgreSQLを用意した上で実行する。

```
./gradlew bootRun
```

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
