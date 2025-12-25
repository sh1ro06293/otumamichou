package models

import (
	"gorm.io/gorm"
)

type Otumami struct {
	gorm.Model
	Name         string `json:"name"`
	Ingredients  string `json:"ingredients"`
	Instructions string `json:"instructions"`
}

type PostOtumami struct {
	gorm.Model
	IncludeIngredients []string `json:"include_ingredients"`
	ExcludeIngredients []string `json:"exclude_ingredients"`
}
