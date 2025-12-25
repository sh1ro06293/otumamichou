package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"github.com/sh1ro06293/otumamichou/auth"
	"github.com/sh1ro06293/otumamichou/config"
	"github.com/sh1ro06293/otumamichou/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm/clause"
)

// generateTokensAndSetCookies はトークン生成とCookie設定をまとめたヘルパー関数
func generateTokensAndSetCookies(c *gin.Context, user *models.User) error {
	// アクセストークンを生成
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

	var domain string
	var secure bool

	if config.IsProd {
		// 【本番環境】
		domain = ""
		secure = true // HTTPS必須

		// クロスサイト対策
		c.SetSameSite(http.SameSiteLaxMode)
	} else {
		// 【ローカル開発環境】
		domain = "localhost"
		secure = false // HTTPなのでfalse

		c.SetSameSite(http.SameSiteLaxMode)
	}

	httpOnly := true

	fmt.Println("Access Token being set in cookie:", accessTokenString)

	c.SetCookie("access_token", accessTokenString, 60*15, "/", domain, secure, httpOnly)
	c.SetCookie("refresh_token", refreshTokenString, 3600*24*7, "/", domain, secure, httpOnly)

	return nil
}

// Register
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

// Login
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

// RefreshToken
func RefreshToken(c *gin.Context) {
	refreshTokenString, err := c.Cookie("refresh_token")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not provided"})
		return
	}
	// DBに保存されているすべての有効なリフレッシュトークンを取得
	var activeTokens []models.RefreshToken
	if err := models.DB.Where("expires_at > ?", time.Now()).Find(&activeTokens).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var matchedToken models.RefreshToken
	var userFound bool

	// 受け取ったトークンとDB内のハッシュを一つずつ比較
	for _, tokenRecord := range activeTokens {
		// ハッシュの比較
		if err := bcrypt.CompareHashAndPassword([]byte(tokenRecord.TokenHash), []byte(refreshTokenString)); err == nil {

			matchedToken = tokenRecord
			userFound = true
			break
		}
	}

	if !userFound {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	var user models.User
	models.DB.First(&user, matchedToken.UserID)
	if err := generateTokensAndSetCookies(c, &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate tokens"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
}

// Logout
func Logout(c *gin.Context) {
	userID, _ := c.Get("user_id")
	models.DB.Where("user_id = ?", userID).Delete(&models.RefreshToken{})
	c.SetCookie("access_token", "", -1, "/", "localhost", false, true)
	c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

// GetUser
func GetUser(c *gin.Context) {
	userID, _ := c.Get("userID")
	fmt.Println("Fetching user with ID:", userID)
	var user models.User
	// パスワードなどを含まないよう、Selectでカラムを明示的に指定
	err := models.DB.Select("UUID", "Name", "Email").Where("id = ?", userID).First(&user).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}
