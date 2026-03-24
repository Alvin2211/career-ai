import React, { use } from 'react'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon } from "lucide-react"
import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';

const GenCourses = () => {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [isResult, setIsResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleSubmitClick = async () => {

        if (!isLoaded || !isSignedIn) {
            alert("User not authenticated");
            return;
        }

        const token = await getToken();
        if (!token) {
            alert("Token not found");
            return;
        }

        const queryvalue = document.getElementById("user-input").value;
        if (!queryvalue) {
            setShowError(true);
            return;
        }
        setLoading(true);
        setShowError(false);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses`, {
                params: { query: queryvalue },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data) {
                console.log("No course data received");
            }
            setIsResult(response.data.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    }
    const mpp ={
        "Guided Project" : "projects",
        "Course": "learn",
        "Specialization": "specializations",
        "Professional Certificate": "professional-certificates",
        "Project":"projects"
    }

    return (

        <section className='min-h-screen bg-[#0e0f11] text-white py-8'>
            {showError && (
                <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900">
                    <AlertTriangleIcon />
                    <AlertTitle>Input Required</AlertTitle>
                    <AlertDescription>
                        Please enter a job title so we can suggest the best courses for you.
                    </AlertDescription>
                </Alert>
            )}
            {!isResult && !loading && (
                <div className='flex flex-col items-center justify-center gap-10 p-10 '>
                    <h1 className='text-4xl md:text-5xl text-center  font-bold'>Get Personalised Course Recommendations</h1>
                    <div className="max-w-md mx-auto bg-neutral-900 mt-5 p-6 rounded-3xl shadow-xl border border-neutral-600 ">

                        <p className="text-neutral-200 mb-6 text-md">What do you want to learn? Describe your career goals  to get personalised course recommendations.</p>

                        <div className="space-y-4 flex flex-col items-center justify-center ">
                            <input
                                type="text"
                                id="user-input"
                                placeholder="e.g. React Developer, Data Analyst..."
                                className="w-full px-5 py-4 bg-neutral-800 border-2 border-transparent rounded-2xl 
             text-neutral-200 placeholder:text-neutral-500 outline-none
              transition-all duration-300"
                            />

                            <button
                                onClick={handleSubmitClick}
                                id="submit-btn"
                                className="py-4 px-4 bg-[#7c7cff] hover:bg-[#7c7cff54] text-white font-semibold 
             rounded-2xl shadow-lg  transition-all active:scale-95"
                            >
                                Suggest Courses
                            </button>
                        </div>
                    </div>
                </div>)}

            {loading && (
                <div className="flex flex-col gap-10 items-center justify-center min-h-[50vh] z-10">
                    <LoaderOne />
                    <p className="text-white mt-3 text-sm">Fetching Courses...</p>
                </div>
            )}

            {isResult && (
                <div className='flex flex-col items-center justify-center gap-10 p-10'>
                    <h1 className='text-4xl md:text-5xl text-center  font-bold'>Top Matches for Your Career Goals</h1>

                    <div className='flex gap-4 flex-nowrap justify-center px-10'>
                        {isResult.map((course, i) => (
                            <div key={i} className='flex flex-col gap-3 bg-black border border-gray-600 text-white rounded-2xl p-5 flex-1 min-w-0 hover:scale-105 transition-transform duration-300'>  

                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-1.5'>
                                        <img src='../../public/coursera-logo.png' alt='Coursera' className='h-15 object-contain' />
                                        <span className='text-xs'>Coursera</span>
                                    </div>
                                    <span className='text-[11px] font-medium bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md'>
                                        {course["Learning Product"]}
                                    </span>
                                </div>

                                <div>
                                    <p className='text-md font-medium leading-snug line-clamp-2'>{course["Title"]}</p>
                                    <p className='text-sm text-gray-200 mt-0.5'>{course["Institution"]}</p>
                                </div>

                                <hr className='border-gray-100' />

                                <div className='grid grid-cols-2 gap-2'>
                                    <div><p className='text-[10px] uppercase tracking-wide text-gray-100'>Rating</p><p className='text-sm font-medium text-amber-600'>★ {course["Rate"]}</p></div>
                                    <div><p className='text-[10px] uppercase tracking-wide text-gray-100'>Level</p><p className='text-sm font-medium text-gray-300'>{course["Level"]}</p></div>
                                    <div className='col-span-2'><p className='text-[10px] uppercase tracking-wide text-gray-100'>Duration</p><p className='text-sm font-medium text-gray-300'>{course["Duration"]}</p></div>
                                </div>

                                <a href={`https://www.coursera.org/${mpp[course["Learning Product"]]}`} className='mt-auto text-center text-xs font-medium bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-md py-1.5 px-3 transition-colors'>
                                    Checkout in Coursera →  
                                </a>

                            </div>
                        ))}
                    </div>

                </div>
            )}

        </section>
    )
}

export default GenCourses;