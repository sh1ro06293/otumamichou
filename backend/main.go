// Ginを使った例
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/sh1ro06293/otumamichou/controllers"
	"github.com/sh1ro06293/otumamichou/initializers"
	"github.com/sh1ro06293/otumamichou/middlewares"
	"github.com/sh1ro06293/otumamichou/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	// 初期化処理を呼び出す
	// ここでは、環境変数の読み込みやDB接続の初期化などを行う
	// _ = godotenv.Load() // .envファイルの読み込み（必要に応じて）
	initializers.LoadEnvVariables() // 環境変数の読み込みå
	initializers.ConnectToDB()      // DB接続の初期化
}

func main() {
	log.Println("Starting application...")

	models.DB.AutoMigrate(&models.User{}, &models.RefreshToken{})

	r := gin.Default()

	// CORS (Cross-Origin Resource Sharing) の設定
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		// AllowOrigins:     []string{"*"}, // すべてのオリジンを許可
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// APIルーティングの設定
	api := r.Group("/api")
	{
		// --- 認証が不要なルート ---
		r.GET("/", func(c *gin.Context) {
			c.String(http.StatusOK, "hello world")
		})
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)
		api.POST("/refresh_token", controllers.RefreshToken)

		// --- 認証が必要なルートグループ ---
		authorized := api.Group("/")
		authorized.Use(middlewares.AuthMiddleware()) // このグループは認証ミドルウェアを通る
		{
			authorized.GET("user", controllers.GetUser)
			authorized.POST("logout", controllers.Logout)
			authorized.GET("otumami", controllers.GetOtumami)
		}
	}

	// Webサーバーをポート8080で起動
	r.Run(":8080")
}
