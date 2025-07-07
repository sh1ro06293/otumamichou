package models

import "time"

// DBのUserTableに対応する構造体
type User struct {
	ID        uint      `gorm:"primaryKey" json:"-"` // JSONには含めない
	UUID      string    `gorm:"type:char(36);unique;not null" json:"uuid"`
	Name      string    `gorm:"type:varchar(100);not null" json:"name"`
	Email     string    `gorm:"type:varchar(255);unique;not null" json:"email"`
	Password  string    `gorm:"type:varchar(255);not null" json:"-"` // JSONには含めない
	CreatedAt time.Time `json:"-"`
}