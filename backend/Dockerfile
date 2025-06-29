FROM golang:1.24

WORKDIR /app

COPY . .

# airのインストールパスを新しいものに修正
RUN apt-get update && apt-get install -y \
    git gcc libc-dev && \
    go install github.com/air-verse/air@latest && \
    go mod download && \
    go mod tidy

COPY .air.toml .air.toml

CMD ["air", "-c", ".air.toml"]