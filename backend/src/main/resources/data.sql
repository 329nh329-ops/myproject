-- 起動のたびにテストデータを入れ直す（学習・動作確認用）
DELETE FROM cards;
DELETE FROM lists;

ALTER SEQUENCE IF EXISTS lists_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS cards_id_seq RESTART WITH 1;

INSERT INTO lists (name, display_order) VALUES
    ('未着手', 0),
    ('進行中', 1),
    ('完了', 2);

INSERT INTO cards (list_id, title, description, priority, due_date, display_order, created_at, updated_at) VALUES
    (1, '要件定義書を読み返す', '', '高', '2026-09-01', 0, now(), now()),
    (1, '画面設計を確認する', '', '中', NULL, 1, now(), now()),
    (2, 'READ APIを実装する', 'カード取得APIをSpring Bootで実装する', '高', NULL, 0, now(), now()),
    (3, '要件定義をまとめる', '', '低', '2026-08-15', 0, now(), now());
