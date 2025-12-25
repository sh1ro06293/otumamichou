package config

import "fmt"

var DSN string

func BuildDSN(dbHost, dbPort, dbUser, dbPassword, dbName string) string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)
}
