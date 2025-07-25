import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";
/* 
{
  "user": "Desmond",
  "job_role": "Software Engineer",
  "employer": "Madhu Marvin",
  "company": "Shell",
  "why_company": "",
  "tone": "Humble",
  "follow_up":"Wanna follow up for the software engineer role in Shell"
}
*/

export interface GenerateMailPayload {
    user: string;
    job_role: string;
    employer: string;
    company: string;
    why_company: string;
    tone: string;
    follow_up: string;
}


export const generateAiEmail = async (payload: GenerateMailPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/generate-email`, payload);
        console.log("The response status is ", response.status);
        return response.data;
    } catch (error: any) {
        console.error("Something went wrong : ", error);

        if (error.response?.status === 429) {
            throw new Error("TOO_MANY_REQUESTS");
        }
        throw new Error("GENERIC_ERROR");
    }
}

