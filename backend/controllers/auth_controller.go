package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"time"

	"github.com/sh1ro06293/otumamichou/auth"
	"github.com/sh1ro06293/otumamichou/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm/clause"
)

// generateTokensAndSetCookies はトークン生成とCookie設定をまとめたヘルパー関数です。
func generateTokensAndSetCookies(c *gin.Context, user *models.User) error {
	// authパッケージの関数を使ってアクセストークンを生成
	accessTokenString, err := auth.GenerateAccessToken(user.ID)
	if err != nil {
		return err
	}

	// リフレッシュトークン（ランダムな文字列）を生成
	refreshExpirationTime := time.Now().Add(7 * 24 * time.Hour)
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return err
	}
	refreshTokenString := base64.URLEncoding.EncodeToString(b)

	// リフレッシュトークンをハッシュ化してDBに保存
	// TODO:ハッシュ化を関数にしてutils/hash.goに移動
	refreshTokenHash, err := bcrypt.GenerateFromPassword([]byte(refreshTokenString), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	refreshToken := models.RefreshToken{
		UserID:    user.ID,
		TokenHash: string(refreshTokenHash),
		ExpiresAt: refreshExpirationTime,
	}
	// ユーザーIDが競合した場合は、トークンハッシュと有効期限を更新する
	if err := models.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"token_hash", "expires_at"}),
	}).Create(&refreshToken).Error; err != nil {
		return err
	}

	// Cookieにセット
	httpOnly := true
	secure := false // ローカル開発のためfalse。本番環境(HTTPS)ではtrueに
	c.SetCookie("access_token", accessTokenString, 60*15, "/", "localhost", secure, httpOnly)
	c.SetCookie("refresh_token", refreshTokenString, 3600*24*7, "/", "localhost", secure, httpOnly)

	return nil
}

// Register はユーザーを新規登録します。
func Register(c *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// TODO:ハッシュ化を関数にしてutils/hash.goに移動
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	newUser := models.User{
		UUID:     uuid.NewString(),
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashedPassword),
	}
	models.DB.Create(&newUser)
	c.JSON(http.StatusOK, gin.H{"message": "User created"})
}

// Login はログイン処理を行います。
func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	var user models.User
	if err := models.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	// パスワードのハッシュと入力されたパスワードを比較
	// TODO:ハッシュ化を関数にしてutils/hash.goに移動
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	if err := generateTokensAndSetCookies(c, &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not set cookies"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"uuid": user.UUID, "name": user.Name, "email": user.Email})
}

// RefreshToken はアクセストークンを再発行します。
func RefreshToken(c *gin.Context) {
	refreshTokenString, err := c.Cookie("refresh_token")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not provided"})
		return
	}

	// 期限切れのアクセストークンからユーザーIDを（署名検証なしで）パースして取得
	accessTokenString, _ := c.Cookie("access_token")
	claims := &auth.AccessTokenClaims{}
	_, _, err = new(jwt.Parser).ParseUnverified(accessTokenString, claims)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token"})
		return
	}

	// DBからリフレッシュトークンを検索・検証
	var refreshToken models.RefreshToken
	if err := models.DB.Where("user_id = ?", claims.UserID).First(&refreshToken).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not found"})
		return
	}
	if time.Now().After(refreshToken.ExpiresAt) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Refresh token expired"})
		return
	}
	// TODO:ハッシュ化を関数にしてutils/hash.goに移動
	if err := bcrypt.CompareHashAndPassword([]byte(refreshToken.TokenHash), []byte(refreshTokenString)); err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	// 検証成功後、新しいトークンペアを発行
	var user models.User
	models.DB.First(&user, refreshToken.UserID)
	if err := generateTokensAndSetCookies(c, &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate tokens"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
}

// Logout はログアウト処理を行います。
func Logout(c *gin.Context) {
	userID, _ := c.Get("user_id")
	models.DB.Where("user_id = ?", userID).Delete(&models.RefreshToken{})
	c.SetCookie("access_token", "", -1, "/", "localhost", false, true)
	c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

// GetUser は認証済みユーザーの情報を返します。
func GetUser(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.User
	// パスワードなどを含まないよう、Selectでカラムを明示的に指定
	models.DB.Select("uuid, name, email").Where("id = ?", userID).First(&user)
	c.JSON(http.StatusOK, user)
}
