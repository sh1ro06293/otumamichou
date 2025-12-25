package initializers

import (
	"fmt"

	"github.com/sh1ro06293/otumamichou/config"
	"github.com/sh1ro06293/otumamichou/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectToDB() {
	fmt.Println("DB接続を開始します...")
	fmt.Println("DSN:", config.DSN)
	db, err := gorm.Open(mysql.Open(config.DSN), &gorm.Config{})
	if err != nil {
		fmt.Println("DB接続に失敗しました:", err)
	} else {
		fmt.Println("DB接続に成功しました")
		models.DB = db
	}
}
