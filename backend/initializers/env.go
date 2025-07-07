package initializers

import (
	"fmt"
	"log"
	"os"

	"github.com/sh1ro06293/otumamichou/config"

	"github.com/joho/godotenv"
)

func init() {
	// .envファイルから環境変数を読み込む
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, loading from environment variables")
	}

	log.Println("Initializing configuration...")

	JwtSecretKeyStr := os.Getenv("JWT_SECRET_KEY")
	if JwtSecretKeyStr == "" {
		log.Fatal("FATAL: Environment variable JWT_SECRET_KEY is not set.")
	}
	config.JwtSecretKey = []byte(JwtSecretKeyStr)

	// DB情報
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	config.DSN = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	log.Println("Configuration loaded successfully.")
}
