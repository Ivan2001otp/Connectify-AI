import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generateAiEmail } from '@/services/httpClient';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { Clipboard } from 'lucide-react';

const JoinRequestForm = () => {
 
    const [formData, setFormData] = useState(
        {
            name : "",
            jobRole : "",
            employer : "",
            company : "",
            reason : "",
            tone : "formal",
            follow_up:"",
        }
    );

    
    const [previewEmail, setPreviewEmail] = useState('');
    const [showEmailCard, setEmailCardVisibility] = useState(false);
    const [links, setLinks] = useState([{label:"", url :""}]);

    const addLink = () => {
        if (links.length < 10) {
            setLinks([...links, {label:"", url :""}]);
        }
    };

   const deleteLink = (index: number) => {
    if (links.length > 1) {
      const updated = [...links];
      updated.splice(index, 1);
      setLinks(updated);
    }
  };

    const handleInputChange = (index:number, field:"label"|"url", url:string)=> {
        const updated = [...links];
        updated[index][field] = url;
        setLinks(updated); 
    };

    const handleChange = (field:string, value:string ) => {
        setFormData(prev => ({...prev, [field]:value}));
    };

    const handleSubmit = async() => {
        console.log("Form data : ", formData);

        let requestPayload  = {
            user : formData.name,
            job_role : formData.jobRole,
            employer : formData.employer,
            company : formData.company,
            why_company : formData.reason,
            tone: formData.tone,
            follow_up:formData.follow_up
        }

        let response = await generateAiEmail(requestPayload);
        console.log("Here this the response : ");
        console.log(response);

        console.log("email template ");
        console.log(response["data"]);
        /*
        let t : string = response['data'];
        let emailChunks:string[] = t.split("\\n")
        console.log("email chunks leng ", emailChunks.length);
        let chunk :string ="";

        for(let i=0;i<emailChunks.length;i++) {
            chunk += emailChunks[i] + '\n';
        }

        console.log("Here is the chunk : ");
        console.log(chunk);
        */
        setPreviewEmail(response['data']);

        setEmailCardVisibility(true);
    };

  return (
    <div className="min-h-screen flex justify-center p-4 bg-gradient-to-r from-indigo-100 to-blue-300">
    
    <div className='w-full max-w-4xl flex flex-col items-center gap-6'>

        <Card
            className="w-full max-w-3xl shadow-2xl border-0"
        >
            <div className="p-8 space-y-6 rounded-md shadow-md">
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-4'>
                    Use Connectify-AI
                </h1>

                {/* Full Name  */}
                <Input
                placeholder='Full Name'
                    value={formData.name}
                    onChange={(e)=>handleChange("name", e.target.value)}

                className='bg-white rounded-lg px-4 py-2'
                
                />

                {/* Job Role  */}
                <Input
                    placeholder='Job Role'
                    value={formData.jobRole}
                    onChange={(e)=>handleChange("jobRole", e.target.value)}

                className='bg-white rounded-lg px-4 py-2'
                  
                />

                {/* Employer Name  */}
                <Input
                    placeholder='Employer Name'
                    value={formData.employer}
                    onChange={(e)=>handleChange("employer", e.target.value)}

                className='bg-white rounded-lg px-4 py-2'
                />

                {/* Company */}

                {
                    formData.tone !== "follow_up" && 
                    <Textarea
                        placeholder='Why do you want to join the company?'
                        value={formData.reason}
                        onChange={(e) => handleChange("reason", e.target.value)}
                        className='bg-white border rounded-lg px-4 py-2 min-h-[100px]'
                    />
                }
                



                {/* dropdown */}
                <div>

                    <label className='text-gray-600 font-semibold mb-1 block'>
                        Select
                    </label>

                    <Select
                        value={formData.tone}
                        onValueChange={(value:string) => handleChange("tone", value)}
                    >
                        <SelectTrigger
                            className='w-full bg-white border px-4 py-2 rounded-lg'
                        >
                            <SelectValue placeholder="Choose tone"/>

                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>

                            <SelectItem value="humble">Humble</SelectItem>

                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>

                            <SelectItem value="follow_up">Follow-Up</SelectItem>

                            <SelectItem  value='casual'>Casual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {
                  formData.tone==="follow_up" &&   (
                            <Textarea
                                placeholder="Your follow up text goes here !"
                                value={formData.follow_up}
                                onChange={(e) => handleChange("follow_up", e.target.value)}
                                className='bg-white border rounded-lg px-4 py-2 min-h-[100px]'
                            />
                    )
                }



                {/* all the hyperlink text  */}
                <CardContent className='space-y-6 shadow-md rounded-lg border-2 py-4 border-slate-200'>
                    {links.map((link, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end"
              >
                <div>
                  <Label htmlFor={`label-${index}`}>Link Text</Label>
                  <Input
                    id={`label-${index}`}
                    value={link.label}
                    placeholder="e.g. Google"
                    onChange={(e) =>
                      handleInputChange(index, "label", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor={`url-${index}`}>URL</Label>
                  <Input
                    id={`url-${index}`}
                    value={link.url}
                    placeholder="e.g. https://google.com"
                    onChange={(e) =>
                      handleInputChange(index, "url", e.target.value)
                    }
                  />
                </div>

                <div className='flex justify-center items-end h-full pb-1'>
                    <Button 
                    variant="ghost"
                    size="icon"
                    disabled={links.length===1}
                    onClick={()=>deleteLink(index)}
                    >
                        <Trash2 className='w-5 h-5 text-red-500'/>
                    </Button>
                </div>
              </div>
            ))}


                    <div className='flex justify-start'>
                        <Button
                            variant="outline"
                            onClick={addLink}
                            disabled={links.length >= 10}
                            className='sm:w-auto w-1/4 hover:bg-gray-700 hover:text-gray-200 hover:rounded-xl duration-300'
                        >{links.length < 10 ? "Add Link" : "Limit Reached"} </Button>
                    </div>
                </CardContent>

                

               


                <Button
                    onClick={handleSubmit}
                    className=" bg-indigo-600 
                    p-4 hover:bg-indigo-800 text-white font-semibold text-lg py-2 rounded-lg transition duration-300"
                >
                    Generate 
                </Button>
            </div>  
        </Card>

       {
        showEmailCard &&    (
            <Card
                className='w-full max-w-3xl mx-auto mt-6 shadow-xl border-0 bg-white relative'
            >
                <CardContent className='p-6'>

                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-2xl font-semibold text-gray-800'>Preview</h2>
                        <button
                            className='text-gray-500 hover:text-black transition'
                            aria-label="Copy email text"
                            onClick={()=>{
                                navigator.clipboard.writeText(previewEmail);
                            }}
                        >
                            <Clipboard/>
                        </button>
                    </div>

                    <pre className='whitespace-pre-wrap bg-gray-50 border rounded-lg p-4 text-gray-700 max-h-[400px] overflow-y-auto'>
                        {previewEmail}
                    </pre>

                    {/* links sections */}
                    {
                        links.length > 0 && (
                            <div className='mt-6'>
                                <ul>
                                    {
                                        links.map((link, index)=> (
                                            <li key={index}>
                                                <a
                                                    href={link.url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-600 underline hover:text-blue-800 transition'
                                                >{link.label}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        )
       }
       </div>
    </div>
  )
}

export default JoinRequestForm


