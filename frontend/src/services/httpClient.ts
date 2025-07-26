import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

export interface GenerateMailPayload {
    user: string;
    job_role: string;
    employer: string;
    company: string;
    why_company: string;
    tone: string;
    follow_up: string;
}


export const generateDissatisfiedEmail = async (payload : GenerateMailPayload, flag : boolean) => {
    console.log(import.meta.env.BASE_URL);
    try {
        const response = await axios.post(`${BASE_URL}/generate-email`, payload,{
            params:{
                flag:true
            }
        });


        console.log("The response status is ", response.status);
        return response.data;
    } catch (error : any) {
        console.error("Something went wrong : ", error);

        if (error.response?.status === 429) {
            throw new Error("TOO_MANY_REQUESTS");
        }
        throw new Error("GENERIC_ERROR");
    }
}

export const generateAiEmail = async (payload: GenerateMailPayload) => {
    console.log(import.meta.env.BASE_URL);

    try {
        const response = await axios.post(`${BASE_URL}/generate-email`, payload,{
            params: {
                flag : false
            }
        });
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

