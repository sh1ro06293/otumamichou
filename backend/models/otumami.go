package models

import (
	"gorm.io/gorm"
)

type Otumami struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Price      float64 `json:"price"`
}

// todo:
"""
	// Otumamiモデルを作成
	// プロンプトに投げる
	// お気に入りをDBに保存する
"""

