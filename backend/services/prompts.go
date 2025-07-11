package services

import (
	"bytes"
	models "connectify-ai-backend/entities"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func CraftColdEmailPrompt(input models.ClientPayload) string {	
	return fmt.Sprintf(`You are professional and successfull cold email writer helping job seekers.
		Write a %s  cold email  to a recruiter/HR/Hiring manager(make it generic) named %s at %s.

		The sender is %s, who is applying for the role of %s. They are passionate about the company because:"%s"

		Keep the email short, personalized and respectful.`,
		input.Tone,
		input.Employer,
		input.Company,
		input.User,
		input.Job_Role,
		input.Why_Company,
	)
}

func ApiCallerToGemini(prompt string) error {

	payload := map[string]interface{}{
		"contents": map[string]interface{}{
			"parts":[]map[string]interface{}{
					{"text":prompt},
				},	
		},
	}

	byteData, err := json.Marshal(payload)

	if err != nil {
		log.Fatalf("Could not parse the request payload of Gemini - %v",err);
		return err;
	}	

	url := os.Getenv("URL")
	
	var apikey string = os.Getenv("GOOGLE_API_KEY")
	// log.Println("api-key is ", apikey)

	
	// build request
	apiRequest, err := http.NewRequest("POST",url,bytes.NewBuffer(byteData));
	if err != nil {
		log.Fatal("Failed to build request - ", err);
		return err;
	}

	// set headers.
	apiRequest.Header.Set("Content-Type","application/json");
	apiRequest.Header.Set("X-goog-api-key",apikey)


	//send request
	client := &http.Client{};

	response, err := client.Do(apiRequest);
	if (err != nil ){
		log.Fatal("Failed to send API request -- ", err);
		return err;
	}
	
	log.Println("The status of API-POST request to Gemini : ", response.StatusCode);
	
	defer response.Body.Close();

	if err != nil {
		log.Println("Something went wrong while fetching response : ", err);
		return err;
	}

	// parse response here
	body, err := ioutil.ReadAll(response.Body);

	var responseJson map[string]interface{}
	if err = json.Unmarshal(body, &responseJson);err != nil {
		log.Println("Could not parse the Gemini Response byte data to json. ");
		log.Println(err);
		return err;
	}

	log.Println("The Gemini API response");
	log.Println(responseJson);

	return nil;
}