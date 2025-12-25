package models

import "time"

type RefreshToken struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	TokenHash string    `json:"token"`
	CreatedAt time.Time `gorm:"not null"`
	ExpiresAt time.Time
}
