import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react'

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

    const handleSubmit = () => {
        console.log("Form data : ", formData);
    };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-indigo-100 to-blue-300">

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
                        onChange={(e) => handleChange("follow_up", e.target.value)}
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

    </div>
  )
}

export default JoinRequestForm

