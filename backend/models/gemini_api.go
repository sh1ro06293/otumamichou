package models

import (
	"gorm.io/gorm"
)

type GeminiRequest struct {
	gorm.Model
	Prompt     string   `json:"prompt"`
	Parameters []string `json:"parameters"`
}

type GeminiResponse struct {
	gorm.Model
	Name         string `json:"name"`
	Ingredients  string `json:"ingredients"`
	Instructions string `json:"instructions"`
}

const Prompt = `おつまみを生成してください。
返信は日本語でjson形式で返却し、以下のフォーマットに従ってください。
{
  "name": "おつまみの名前",
  "ingredients": "材料",
  "instructions": "作り方"
}`

const Messege = `以下の条件を満たすおつまみを提案してください。
入れて欲しいもの: %v
入れないで欲しいもの: %v`
