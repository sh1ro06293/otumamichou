package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sh1ro06293/otumamichou/api"
	"github.com/sh1ro06293/otumamichou/models"
)

func POSTOtumami(c *gin.Context) {

	var postOtumami models.PostOtumami
	if err := c.ShouldBindJSON(&postOtumami); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	fmt.Println("Received POST /otumami with data:", postOtumami.IncludeIngredients, postOtumami.ExcludeIngredients)

	response := api.SendGeminiRequest(postOtumami.IncludeIngredients, postOtumami.ExcludeIngredients)

	data := models.Otumami{
		Name:         response.Name,
		Ingredients:  response.Ingredients,
		Instructions: response.Instructions,
	}

	c.JSON(http.StatusOK, gin.H{"data": data})
	// c.JSON(http.StatusOK, gin.H{"otumami": "ok"})

}

func GETOtumami(c *gin.Context) {

	api.SendGeminiRequest([]string{"チーズ"}, []string{"ナッツ"})
	// response := sendOpenAIRequest()
	c.JSON(http.StatusOK, gin.H{"otumami": "ok"})

}
