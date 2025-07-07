package middlewares

import (
	"net/http"

	"github.com/sh1ro06293/otumamichou/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sh1ro06293/otumamichou/auth"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("access_token")

		if err != nil {
			// トークンがななければ401
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization token not provided"})
			return
		}

		claims := &auth.AccessTokenClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecretKey, nil
		})
		if err != nil || token.Valid {
			// トークンの検証に失敗した場合は401
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// トークンが有効な場合、ユーザー情報を取得
		c.Set("userID", claims.UserID)

		c.Next()
	}
}
