package initializers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/sh1ro06293/otumamichou/config"
)

func LoadEnvVariables() {
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
	if dbUser == "" || dbPassword == "" || dbName == "" || dbHost == "" || dbPort == "" {
		log.Fatal("FATAL: One or more database environment variables are not set.")
	}

	config.DSN = config.BuildDSN(dbHost, dbPort, dbUser, dbPassword, dbName)
	log.Println("Database configuration loaded successfully.")

	log.Println("Configuration loaded successfully.")

	// GEMINI_API_KEYの読み込み
	geminiApiKey := os.Getenv("GEMINI_API_KEY")
	if geminiApiKey == "" {
		log.Fatal("FATAL: Environment variable GEMINI_API_KEY is not set.")
	}
}
