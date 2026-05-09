import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { LoaderOne } from "@/components/ui/loader";
import axios from "axios";
import { useState, useEffect } from "react";

const MockInterview = () => {
    const { getToken } = useAuth();
    const [showError, setShowError] = useState(false);
    return (

        <section className="bg-dot-pattern min-h-screen bg-black text-white py-8">
            <div
                className={`w-full flex justify-center transition-all duration-500 ease-in-out overflow-hidden
          ${showError ? "opacity-100 translate-y-0 max-h-40 mb-4" : "opacity-0 -translate-y-2 max-h-0"}`}
            >
                <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900">
                    <AlertTriangleIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>'' </AlertDescription>
                </Alert>
            </div>

            <div className="flex flex-col items-center justify-center gap-5 p-10">
                <h1 className="text-4xl md:text-5xl text-center font-bold">
                    AI Mock Interview
                </h1>
                <p className="text-neutral-300 text-lg mb-5">
                    Practice real-world interview questions tailored to your role,
                    difficulty level, and interview type — powered by AI feedback.
                </p>
                <div className="flex flex-col max-w-full mx-auto bg-neutral-900 mt-3 p-6 rounded-3xl shadow-xl border border-neutral-600 gap-8">
                    <div className=" flex gap-10">
                        <div>
                            <label className="flex mb-2 text-md text-zinc-400 justify-center items-center ">
                                Job Role
                            </label>
                            <input
                                type="text"
                                placeholder="e.g Frontend Developer"
                                className=" w-50 text-neutral-300 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white transition placeholder:text-neutral-300"
                            />
                        </div>

                        <div>
                            <label className="flex mb-2 text-md text-zinc-400 justify-center items-center">
                                Difficulty
                            </label>

                            <select className=" w-50 text-neutral-300 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white transition ">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex mb-2 text-md text-zinc-400 justify-center items-center">
                                Interview Type
                            </label>

                            <select className="w-50  bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white transition">
                                <option>Technical</option>
                                <option>HR</option>
                                <option>Behavioral</option>
                                <option>System Design</option>
                                <option>Management</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={() => { }}
                            id="submit-btn"
                            className="py-4 px-8 w-auto bg-[#7c7cff] hover:bg-[#7c7cff54] text-white font-semibold
                                    rounded-2xl shadow-lg transition-all active:scale-95"
                        >
                            Generate Roadmap
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MockInterview
