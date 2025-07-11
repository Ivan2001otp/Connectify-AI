package handlers

import (
	models "connectify-ai-backend/entities"
	services "connectify-ai-backend/services"
	"encoding/json"
	"log"
	"net/http"
	"os"
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

	var apikey string = os.Getenv("GOOGLE_API_KEY")

	//https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
	log.Println("api-key is ", apikey)

	var prompt string = services.CraftColdEmailPrompt(requestPayload)
	err = services.ApiCallerToGemini(prompt)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := map[string]interface{}{
			"status":  http.StatusInternalServerError,
			"message": "Something went wrong .Please try again",
		}

		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
}
