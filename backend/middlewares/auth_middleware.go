package middlewares

import (
	"fmt"
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
			// トークンがなければ401
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization token not provided"})
			return
		}

		claims := &auth.AccessTokenClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecretKey, nil
		})

		// 「エラーがある」または「トークンが有効でない」場合に弾く
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// トークンが有効な場合、ユーザー情報をコンテキストにセット
		c.Set("userID", claims.UserID)
		fmt.Println("Authenticated user ID:", claims.UserID)

		c.Next()
	}
}
