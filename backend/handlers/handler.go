package handlers

import (
	models "connectify-ai-backend/entities"
	services "connectify-ai-backend/services"
	"encoding/json"
	"fmt"
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

	fmt.Println("Here is the prompt : ");
	fmt.Println(prompt);
	// here i make an api call
	text, err := (services.ApiCallerToGemini(prompt));

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



// follow mail response
/*
{
  "data": "This is a well-written and professional follow-up email! Here's a breakdown of why it works and some minor tweaks for potential improvement:\n\n**What Works Well:**\n\n*   **Concise and Direct:** It gets straight to the point without being overly verbose.\n*   **Positive Tone:** The \"great week\" greeting and \"genuinely excited\" expressions create a positive impression.\n*   **Personalized:** Mentioning a specific detail about the role shows genuine interest. Replace `[insert a specific detail about the role]` with something specific you know about the role or Shell to make it even better.\n*   **Value Proposition:** Highlights the desire to \"contribute\" and bring in \"fresh energy.\"\n*   **Clear Call to Action:** Directly asks for a call and offers to share more.\n*   **Professional Closing:** \"Cheers\" is a friendly and appropriate closing.\n*   **Use of Emoji:** The rocket emoji is generally acceptable in these kinds of follow-ups, especially if the initial communication was more casual. However, consider the culture of Shell. If you know they are very formal, consider removing it.\n\n**Potential Improvements and Suggestions:**\n\n*   **Replace \"[insert a specific detail about the role]\" with a specific detail.** This is crucial for making the email feel personalized and demonstrates that you've done your research. For example, you could say something like:\n    *   \"...especially because the focus on sustainable energy solutions really resonates with me.\"\n    *   \"...especially because the opportunity to work with cutting-edge cloud technologies really excites me.\"\n    *   \"...especially because I'm eager to contribute to the development of your data analytics platform.\"\n\n*   **Consider Briefly Re-Stating Your Key Skills:** While you don't want to repeat your entire resume, subtly mentioning one or two key skills that align with the role can be beneficial. You could weave it into the sentence about adding value:\n    *   \"...share more about how my experience in Python development and cloud infrastructure management can add value.\"\n    *   \"...share more about how my expertise in data analysis and machine learning can add value.\"\n\n*   **Subject Line:** The current subject line (\"Just wanted to bump this up 🚀\") is functional.  You could make it a little more compelling (while still remaining professional):\n    *   \"Following Up: Software Engineer Role at Shell\"\n    *   \"Software Engineer Role at Shell - [Your Name]\"\n    *   \"Software Engineer Role - Excited to Discuss My Fit\"\n\n**Example incorporating some suggestions:**\n\nSubject: Following Up: Software Engineer Role at Shell\n\nHey Madhu Marvin,\n\nI hope you’ve been having a great week! I wanted to quickly follow up on my previous note about the Software Engineer role at Shell.\n\nI’m genuinely excited about the possibility of joining the Shell team — especially because the opportunity to work with cutting-edge cloud technologies really excites me. I’d be thrilled to contribute and bring in fresh energy to the table, and share more about how my experience in AWS and Kubernetes can add value.\n\nIf it makes sense to chat further, I’d love to jump on a quick call.\nLooking forward to hearing from you!\n\nCheers,\nDesmond\n\n**Overall:**\n\nYour email is already in good shape.  Making it even more specific and tailoring it to the specific requirements of the role will make it even stronger and increase your chances of getting a response.  Good luck!\n",
  "status": 200
}
*/

// normal cold mail response
/*
{
  "data": "Subject: Backend Developer - Immanuel Dsouza - Driven by Deloitte's Engineering\n\nDear Mr. Murthy,\n\nMy name is Immanuel Dsouza, and I'm writing to express my keen interest in Backend Developer opportunities at Deloitte. I've been consistently impressed by the challenging engineering tasks undertaken at Deloitte and the steep learning curve you provide for your engineers. This really resonates with my own aspirations.\n\nI've attached my resume for your review, highlighting my experience in [mention 1-2 relevant skills/technologies from the job description]. I am confident that my skills and passion would be a valuable asset to your team.\n\nThank you for your time and consideration. I would welcome the opportunity to discuss how I can contribute to Deloitte's success.\n\nSincerely,\n\nImmanuel Dsouza\n",
  "status": 200
}
*/
