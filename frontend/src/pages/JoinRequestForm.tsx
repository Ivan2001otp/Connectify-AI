import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  generateAiEmail,
  generateDissatisfiedEmail,
} from "@/services/httpClient";
import { ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { Clipboard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const JoinRequestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    jobRole: "",
    employer: "",
    company: "",
    reason: "",
    tone: "formal",
    follow_up: "",
  });

  const [error, setError] = useState({
    name: "",
    jobRole: "",
    employer: "",
    company: "",

    tone: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(previewEmail);
    toast.success("Copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [previewEmail, setPreviewEmail] = useState("");
  const [showEmailCard, setEmailCardVisibility] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() ? "" : "*Required",
      jobRole: formData.jobRole.trim() ? "" : "*Required",
      employer: formData.employer.trim() ? "" : "*Employer name",
      company: formData.company.trim() ? "" : "*Company name required",
      tone: formData.tone ? "" : "Tone is required",
    };

    setError(newErrors);

    return Object.values(newErrors).every((errorMsg) => errorMsg === "");
  };

  const handleSubmitDissatisfied = async () => {
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if (formData.reason.length === 0 && formData.follow_up.length === 0) {
      setLoading(false);
      console.log("exe here !");
      alert("Please fill the 'reason'/'follow-up' text-field .");
      return;
    }

    let requestPayload = {
      user: formData.name,
      job_role: formData.jobRole,
      employer: formData.employer,
      company: formData.company,
      why_company: formData.reason,
      tone: formData.tone,
      follow_up: formData.follow_up,
    };

    try {
      let response = await generateDissatisfiedEmail(requestPayload);
      setLoading(false);
      console.log("Here this the response : ");
      console.log(response);

      console.log("email template ");
      console.log(response["data"]);

      setPreviewEmail(response["data"]);
      setEmailCardVisibility(true);
      toast.success("success");
    } catch (error: any) {
      console.log("I caught the error at the frontend.");
      if (error.message === "TOO_MANY_REQUESTS") {
        toast.error("Too Many Requests... You got to slow down Bro !!");
      } else {
        toast.error(error.message);
      }

      setPreviewEmail("");
      setEmailCardVisibility(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if (formData.tone === "follow_up") {
      formData.reason = "";
    } else {
      formData.follow_up = "";
    }

    if (formData.reason.length === 0 && formData.follow_up.length === 0) {
      setLoading(false);
      alert("Please fill the 'reason'/'follow-up' text-field .");
      return;
    }

    let requestPayload = {
      user: formData.name,
      job_role: formData.jobRole,
      employer: formData.employer,
      company: formData.company,
      why_company: formData.reason,
      tone: formData.tone,
      follow_up: formData.follow_up,
    };

    try {
      let response = await generateAiEmail(requestPayload);
      setLoading(false);

     
      setPreviewEmail(response["data"]);
      setEmailCardVisibility(true);
      toast.success("success");
    } catch (error: any) {

      if (error.message === "TOO_MANY_REQUESTS") {
        toast.error("Too Many Requests... You got to slow down Bro !!");
      } else {
        toast.error(error.message);
      }
      setPreviewEmail("");
      setEmailCardVisibility(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    //bg-gradient-to-r from-indigo-100 to-blue-300
    <div className="min-h-screen  flex justify-center p-4 animate-hop transition-all duration-1500">
      <Toaster />
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <Card className="w-full max-w-3xl shadow-2xl border-0">
          <div className="p-8 space-y-6 rounded-md shadow-md">
            <div className="flex items-center justify-center space-x-4">
              <img
                src="/Connectify-AI.png" // ✅ replace with your actual path
                alt="Connectify AI "
                width={70} height={70}
                className=" rounded-md"
              />
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
                Connectify-AI
              </h1>
            </div>

            <p className="text-center text-gray-500 text-sm font-bold">
              Generate personalized cold emails for job outreach 
            </p>

            {/* Full Name  */}

            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white rounded-lg px-4 py-2"
              />
              {error.name && (
                <p className="text-red-500 text-sm">{error.name}</p>
              )}

              {/* Job Role  */}
              <Input
                placeholder="Job Role"
                value={formData.jobRole}
                onChange={(e) => handleChange("jobRole", e.target.value)}
                className="bg-white rounded-lg px-4 py-2"
              />
              <small className="text-gray-400 text-xs">
                e.g., SDE , Devops, Game-Dev
              </small>
              {error.jobRole && (
                <p className="text-red-500 text-sm">{error.jobRole}</p>
              )}

              {/* Employer Name  */}
              <Input
                placeholder="Employer Name"
                value={formData.employer}
                onChange={(e) => handleChange("employer", e.target.value)}
                className="bg-white rounded-lg px-4 py-2"
              />
              <small className="text-gray-400 text-sm">
                e.g.,David B - Director of Engineering
              </small>
              {error.employer && (
                <p className="text-red-500 text-sm">{error.employer}</p>
              )}

              {/* Company name  */}
              <Input
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="bg-white rounded-lg px-4 py-2"
              />
              <small className="text-gray-400 text-xs">
                Eg:,Alphabet, Wisk, etc
              </small>
              {error.company && (
                <p className="text-red-500 text-sm">{error.company}</p>
              )}
            </div>

            {formData.tone !== "follow_up" && (
              <Textarea
                placeholder="Why do you want to join the company?"
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                className="bg-white border rounded-lg px-4 py-2 min-h-[100px]"
              />
            )}

            {/* dropdown */}
            <div>
              <label className="text-gray-600 font-semibold mb-1 block">
                Select Pitch Tone
              </label>

              <Select
                value={formData.tone}
                onValueChange={(value: string) => handleChange("tone", value)}
              >
                <SelectTrigger className="w-full bg-white border px-4 py-2 rounded-lg">
                  <SelectValue placeholder="Choose tone" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>

                  <SelectItem value="humble">Humble</SelectItem>

                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>

                  <SelectItem value="follow_up">Follow-Up</SelectItem>

                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
              <small className="md:mr-2 mt-3 text-gray-400 text-xs">
                Pick the tone
              </small>
            </div>

            {formData.tone === "follow_up" && (
              <Textarea
                placeholder="Write your follow up mail points here !"
                value={formData.follow_up}
                onChange={(e) => handleChange("follow_up", e.target.value)}
                className="bg-white border rounded-lg px-4 py-2 min-h-[100px]"
              />
            )}

            <Button
              disabled={isLoading}
              onClick={handleSubmit}
              className=" bg-indigo-600 
                    p-4 hover:bg-indigo-800 text-white font-semibold text-lg py-2 rounded-lg transition duration-300"
            >
              {isLoading ? "Generating...." : "Generate"}
            </Button>
          </div>
        </Card>

        {showEmailCard && (
          <Card className="w-full max-w-3xl mx-auto mt-6 shadow-xl border-0 bg-white relative">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Preview
                </h2>

                <div className="justify-between items-center space-x-4 flex">
                  <button
                    onClick={() => handleSubmitDissatisfied()}
                    className="text-gray-700  hover:text-black transition border-2 hover:border-slate-700 duration-300  rounded-lg p-2"
                  >
                    {isLoading ? "Loading..." : "Not Interested"}
                  </button>

                  <button
                    className="text-gray-500 hover:text-black transition"
                    aria-label="Copy email text"
                    onClick={() => handleCopy()}
                  >
                    {copied ? (
                      <ClipboardCheck className="text-green-500" />
                    ) : (
                      <Clipboard />
                    )}
                  </button>
                </div>
              </div>

              <pre className="whitespace-pre-wrap bg-gray-50 border rounded-lg p-4 text-gray-700 max-h-[400px] overflow-y-auto">
                {previewEmail}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JoinRequestForm;
