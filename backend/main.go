// Ginを使った例
package main

import (
	"log"

	"github.com/sh1ro06293/otumamichou/controllers"
	_ "github.com/sh1ro06293/otumamichou/initializers"
	"github.com/sh1ro06293/otumamichou/middlewares"
	"github.com/sh1ro06293/otumamichou/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting application...")

	models.DB.AutoMigrate(&models.User{}, &models.RefreshToken{})

	r := gin.Default()

	// CORS (Cross-Origin Resource Sharing) の設定
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // フロントエンドのURL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true, // Cookieの送受信に必須
	}))

	// APIルーティングの設定
	api := r.Group("/api")
	{
		// --- 認証が不要なルート ---
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)
		api.POST("/refresh_token", controllers.RefreshToken)

		// --- 認証が必要なルートグループ ---
		authorized := api.Group("/")
		authorized.Use(middlewares.AuthMiddleware()) // このグループは認証ミドルウェアを通る
		{
			authorized.GET("/user", controllers.GetUser)
			authorized.POST("/logout", controllers.Logout)
		}
	}

	// Webサーバーをポート8080で起動
	r.Run(":8000")
}
