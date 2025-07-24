package handlers

import (
	models "connectify-ai-backend/entities"
	services "connectify-ai-backend/services"
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

	var prompt string;

	if (len(requestPayload.Follow_Up)==0) {
	 prompt  = services.CraftColdEmailPrompt(requestPayload)

	} else {
		prompt = services.CraftFollowUpEmailPrompt(requestPayload);
	}

	// here i make an api call
	text, err := (services.ApiCallerToGemini(prompt))

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := map[string]interface{}{
			"status":  http.StatusInternalServerError,
			"message": "Something went wrong .Please try again",
		}

		json.NewEncoder(w).Encode(response)
		return
	}

	response := map[string]interface{}{
		"data":   text,
		"status": http.StatusOK,
	}

	json.NewEncoder(w).Encode(response)
	w.WriteHeader(http.StatusOK)
}

/*
{
  "data": "Subject: Backend Developer - Immanuel Dsouza - Driven by Deloitte's Engineering\n\nDear Mr. Murthy,\n\nMy name is Immanuel Dsouza, and I'm writing to express my keen interest in Backend Developer opportunities at Deloitte. I've been consistently impressed by the challenging engineering tasks undertaken at Deloitte and the steep learning curve you provide for your engineers. This really resonates with my own aspirations.\n\nI've attached my resume for your review, highlighting my experience in [mention 1-2 relevant skills/technologies from the job description]. I am confident that my skills and passion would be a valuable asset to your team.\n\nThank you for your time and consideration. I would welcome the opportunity to discuss how I can contribute to Deloitte's success.\n\nSincerely,\n\nImmanuel Dsouza\n",
  "status": 200
}
*/
