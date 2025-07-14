import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react'

const JoinRequestForm = () => {
 
    const [formData, setFormData] = useState(
        {
            name : "",
            jobRole : "",
            employer : "",
            company : "",
            reason : "",
            tone : "formal"
        }
    );

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
                    Join our Awesome Community
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
                <Textarea
                    placeholder='Why do you want to join the company?'
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    className='bg-white border rounded-lg px-4 py-2 min-h-[100px]'
                />

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

                            <SelectItem
                            value='casual'
                            >Casual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


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

