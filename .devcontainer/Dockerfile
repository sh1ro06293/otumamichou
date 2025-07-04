# 開発用のベースイメージを使用
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
    # ★★★ Goのアーキテクチャをarm64に変更 ★★★
    wget "https://go.dev/dl/go${GO_VERSION}.linux-arm64.tar.gz" -O /tmp/go.tar.gz \
  && \
    tar -C /usr/local -xzf /tmp/go.tar.gz \
  && \
    rm /tmp/go.tar.gz \
  && \
    # arm64ネイティブで動くためCGO無効化は不要
    /usr/local/go/bin/go install golang.org/x/tools/gopls@latest \
  && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# nvmとNode.jsをインストール
RUN wget -qO /tmp/install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh \
 && chmod +x /tmp/install.sh
RUN su vscode -c "/tmp/install.sh"
RUN su vscode -c ' \
    . "/home/vscode/.nvm/nvm.sh" && \
    nvm install ${NODE_VERSION} && \
    nvm alias default ${NODE_VERSION} \
'
RUN rm /tmp/install.sh

# Goのパスのみをコンテナ全体で有効にする
ENV PATH="/usr/local/go/bin:${PATH}"