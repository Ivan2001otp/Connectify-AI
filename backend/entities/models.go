package entities

type ClientPayload struct {
	User        string `json:"user"`
	Job_Role    string `json:"job_role"`
	Employer    string `json:"employer"`
	Company     string `json:"company"`
	Why_Company string `json:"why_company"`
	Tone        string `json:"tone"`
}

type ClientResponse struct {
	Email_Payload string `json:"email_payload"`
}
