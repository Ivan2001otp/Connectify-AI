package main

type ClientPayload struct{
	user string `json:"user"`;
	job_role string `json:"job_role"`;
	employer string `json:"employer"`;
	company string `json:"company"`;
	why_company string `json:"why_company"`;
	tone string `json:"tone"`;
}

type ClientResponse struct {
	email_payload string `json:"email_payload"`;
}