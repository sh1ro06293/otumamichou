# 開発用のベースイメージを使用 (Gitや基本的なツールはプリインストール済み)
FROM mcr.microsoft.com/devcontainers/base:bullseye

# ARGでバージョンを管理
ARG GO_VERSION=1.22.5
ARG NODE_VERSION=20

# 必要なツールをインストールし、Go言語とgoplsをセットアップ
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    git \
    build-essential \
  && \
    wget "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" -O /tmp/go.tar.gz \
  && \
    tar -C /usr/local -xzf /tmp/go.tar.gz \
  && \
    rm /tmp/go.tar.gz \
  && \
    # CGOを無効にしてgoplsをインストール（アーキテクチャ問題を回避）
    CGO_ENABLED=0 /usr/local/go/bin/go install golang.org/x/tools/gopls@latest \
  && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# nvmとNode.jsをインストール
# 1. nvmのインストールスクリプトをダウンロードして実行権限を付与
RUN wget -qO /tmp/install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh \
 && chmod +x /tmp/install.sh

# 2. vscodeユーザーとしてインストールスクリプトを実行
RUN su vscode -c "/tmp/install.sh"

# 3. vscodeユーザーとしてnvmを使いNode.jsをインストール
RUN su vscode -c ' \
    . "/home/vscode/.nvm/nvm.sh" && \
    nvm install ${NODE_VERSION} && \
    nvm alias default ${NODE_VERSION} \
'

# 4. インストールスクリプトをクリーンアップ
RUN rm /tmp/install.sh

# Goのパスのみをコンテナ全体で有効にする
ENV PATH="/usr/local/go/bin:${PATH}"