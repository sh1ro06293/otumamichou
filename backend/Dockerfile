FROM golang:1.24-alpine

WORKDIR /app

RUN go install github.com/cosmtrek/air@v1.51.0

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["air", "-c", ".air.toml"]
