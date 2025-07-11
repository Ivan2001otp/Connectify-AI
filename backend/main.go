package main

import (
	"log"
	"net/http"
	"os"

	handlers "connectify-ai-backend/handlers"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Something went wrong while loading credentials")
		return
	}

	mainRouter := mux.NewRouter()

	// cors
	corsOptions := cors.New(cors.Options{
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Content-Type"},
		AllowedOrigins:   []string{"http://localhost:5173"},
	})

	mainRouter.HandleFunc("/api/v1/generate-email", handlers.LLMResponseHandler).Methods("POST")

	handler := corsOptions.Handler(mainRouter)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Println("Backend running ...")
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

/*
map[candidates:[map[avgLogprobs:-0.2859400079605427 content:map[parts:[map[text:Subject: Software Engineer 2 - Ivan [Your Last Name]

Dear Dave H,

I hope this email finds you well.

My name is Ivan [Your Last Name], and I'm writing to express my strong interest in Software Engineer 2 opportunities at Amazon. I've been consistently impressed by Amazon's compensation packages for its employees and I am eager to learn more about potentially contributing to the team.

I've attached my resume for your review, highlighting my experience in [Mention 1-2 relevant skills/technologies e.g., Java development, Cloud computing]. I'm confident my skills and passion align with Amazon's innovative spirit.

Thank you for your time and consideration. I would be grateful for the opportunity to discuss how I can contribute to Amazon.

Sincerely,

Ivan [Your Last Name]
[Your Phone Number]
[Link to your LinkedIn Profile (Optional)]
]] role:model] finishReason:STOP]] modelVersion:gemini-2.0-flash responseId:caNwaJuiPM6Cm9IP8bL_2AQ usageMetadata:map[candidatesTokenCount:188 candidatesTokensDetails:[map[modality:TEXT tokenCount:188]] promptTokenCount:82 promptTokensDetails:[map[modality:TEXT tokenCount:82]] totalTokenCount:270]]
*/
