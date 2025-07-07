FROM node:20

WORKDIR /usr/src/app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリのソースコードをコピー
COPY . .

CMD ["npm", "run","dev"]