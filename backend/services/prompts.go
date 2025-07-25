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
	return fmt.Sprintf(`You are an expert cold email writer helping job seekers craft concise, personalized, and respectful messages.

Write a %s cold email addressed to %s, who works at %s in a recruiting or decision-making role.

The sender is %s, applying for the position of %s. They are genuinely excited about the opportunity because: "%s".

Keep the email short (under 120 words), engaging, and naturally conversational. Do not include any placeholders or formalities like "To Whom It May Concern". Write in a tone that feels human, confident, and tailored.`,
		input.Tone,
		input.Employer,
		input.Company,
		input.User,
		input.Job_Role,
		input.Why_Company,
	)
}

func CraftFollowUpEmailPrompt(input models.ClientPayload) string {
	return fmt.Sprintf(`Subject: Following up on the %s opportunity at %s

Hi %s,

Just wanted to follow up on my note regarding the %s role at %s. I’m genuinely excited about the possibility of contributing to the team — especially since %s really aligns with what drives me.

If it feels like a good fit, I’d be glad to share how I can add value or hop on a quick call to chat more.

Appreciate your time and looking forward to connecting!

Best,  
%s
`, input.Job_Role, input.Company, input.Employer, input.Job_Role, input.Company, input.Why_Company, input.User)
}

func ApiCallerToGemini(prompt string) (*string, error) {

	payload := map[string]interface{}{
		"contents": map[string]interface{}{
			"parts": []map[string]interface{}{
				{"text": prompt},
			},
		},
	}

	byteData, err := json.Marshal(payload)

	if err != nil {
		log.Fatalf("Could not parse the request payload of Gemini - %v", err)
		return nil, err
	}

	url := os.Getenv("URL")

	var apikey string = os.Getenv("GOOGLE_API_KEY")

	// build request
	apiRequest, err := http.NewRequest("POST", url, bytes.NewBuffer(byteData))
	if err != nil {
		log.Fatal("Failed to build request - ", err)
		return nil, err
	}

	// set headers.
	apiRequest.Header.Set("Content-Type", "application/json")
	apiRequest.Header.Set("X-goog-api-key", apikey)

	//send request
	client := &http.Client{}

	response, err := client.Do(apiRequest)
	if err != nil {
		log.Fatal("Failed to send API request -- ", err)
		return nil, err
	}

	log.Println("The status of API-POST request to Gemini : ", response.StatusCode)

	defer response.Body.Close()

	if err != nil {
		log.Println("Something went wrong while fetching response : ", err)
		return nil, err
	}

	// parse response here
	body, err := ioutil.ReadAll(response.Body)

	var responseJson map[string]interface{}
	if err = json.Unmarshal(body, &responseJson); err != nil {
		log.Println("Could not parse the Gemini Response byte data to json. ")
		log.Println(err)
		return nil, err
	}

	log.Println("The Gemini API response")
	log.Println(responseJson)

	ai_generated_email := pickContentFromJson(responseJson)

	return ai_generated_email, nil
}

func pickContentFromJson(response map[string]interface{}) *string {
	candidates, ok := response["candidates"].([]interface{})

	if !ok || len(candidates) == 0 {
		log.Println("Not candidate key in response")
		return nil
	}

	firstCandidate := candidates[0].(map[string]interface{})
	content := firstCandidate["content"].(map[string]interface{})
	parts := content["parts"].([]interface{})

	if len(parts) > 0 {
		part := parts[0].(map[string]interface{})
		text, ok := part["text"].(string)

		if ok {
			log.Println("Extract Text : \n", text)
			return &(text)
		} else {
			log.Println("Text field not found !")
		}
	}

	return nil
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
