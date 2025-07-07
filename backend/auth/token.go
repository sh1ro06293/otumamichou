package auth

import (
	"time"

	"github.com/sh1ro06293/otumamichou/config"

	"github.com/golang-jwt/jwt/v5"
)

type AccessTokenClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// useridを受け取り、アクセストークンを生成する関数

func GenerateAccessToken(userID uint) (string, error) {
	expirationTime := time.Now().Add(3 * time.Hour)
	claims := &AccessTokenClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.JwtSecretKey)
}

// 受け取ったトークンを検証する関数
func ValidateToken(tokenString string) (*AccessTokenClaims, error) {
	claims := &AccessTokenClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return config.JwtSecretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, jwt.ErrTokenUnverifiable
	}
	return claims, nil
}
