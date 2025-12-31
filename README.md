# Otumamichou

## 概要
AIに入れたい食べ物と入れたくない食べ物を送り、おつまみを生成してくれるサービス

## 起動方法

```sh
docker-compose up --build
```

## 技術スタック
- フロントエンド  
  - React(typescript) + Vite
- バックエンド
  - go
- データベース
  - Mysql
- api
  - ~~OpenAI~~
  - Gemini
- インフラ
  - ~~aws~~
  - 自宅の鯖


## 各種URL

- **デプロイURL**  
  [https://otumami.merryshiro.org/](https://otumami.merryshiro.org/)


- **フロントエンド（React）**  
  [http://localhost:5173](http://localhost:5173)

- **バックエンド(go)**  
  [http://localhost:8000](http://localhost:8000)

- **phpMyAdmin（DB管理画面）**  
  [http://localhost:8080](http://localhost:8080)


## 備考

- 初回起動時、`DB/sql/001-create-tables.sql` により自動でテーブルが作成されます。
- DBの永続化データは `DB/date` ディレクトリに保存されます。
