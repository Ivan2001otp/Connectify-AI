package services

import (
	models "connectify-ai-backend/entities"
	"fmt"
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
