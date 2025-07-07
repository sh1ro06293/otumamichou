package initializers

import (
	"fmt"
	"os"

	"github.com/sh1ro06293/otumamichou/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectToDB() {
	db, err := gorm.Open(mysql.Open(os.Getenv("DSN")), &gorm.Config{})
	if err != nil {
		fmt.Println("DB接続に失敗しました:", err)
	} else {
		fmt.Println("DB接続に成功しました")
		models.DB = db
	}
}
