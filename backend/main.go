package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	handlers "connectify-ai-backend/handlers"

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
