package handlers

import (
	models "connectify-ai-backend/entities"
	"encoding/json"
	"log"
	"net/http"
)

func LLMResponseHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "only POST method is allowed", http.StatusBadRequest)
		return
	}

	var requestPayload models.ClientPayload
	err := json.NewDecoder(r.Body).Decode(&requestPayload)

	if err != nil {
		log.Fatalf("Something went wrong while parsing request body - %v", err)
		return
	}

	log.Println("request payload is")
	log.Println(requestPayload)
}
