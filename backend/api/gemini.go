package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/sh1ro06293/otumamichou/models"
	"google.golang.org/genai"
)

func SendGeminiRequest(IncludeIngredients, ExcludeIngredients []string) models.GeminiResponse {

	ctx := context.Background()

	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType:  "application/json",
		SystemInstruction: genai.NewContentFromText(models.Prompt, genai.RoleUser),
	}

	result, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		genai.Text(fmt.Sprintf(models.Messege, IncludeIngredients, ExcludeIngredients)),
		config,
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(result.Text())

	fmt.Println("----")
	var res models.GeminiResponse
	if err := json.Unmarshal([]byte(result.Text()), &res); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}
	return res
}
