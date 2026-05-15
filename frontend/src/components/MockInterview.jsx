import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { LoaderOne } from "@/components/ui/loader";
import axios from "axios";
import { useState, useEffect } from "react";
import Interview from "@/components/Interview";
import Sidebar from "@/components/Sidebar";

const MockInterview = () => {
    const { getToken } = useAuth();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [job, setJob] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [interviewType, setInterviewType] = useState("Technical");
    const [result, setResult] = useState(null);

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchHistory = async () => {
            const token = await getToken();
            if (!token) return;
            try {
                const res = await axios.get(`${API_BASE}/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setHistoryLoading(false);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const handleGenerateClick = async () => {
        const token = await getToken();

        if (!job || job.trim().length < 3 || job.length > 25) {
            setErrorMessage("Please enter a job role between 3 and 25 characters.");
            setShowError(true);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE}/start`,
                { jobRole: job, difficulty, interviewType },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data) throw new Error("No data received");
            setResult(response.data);
        } catch (error) {
            console.error("Error starting mock interview:", error);
            setErrorMessage("Service is temporarily unavailable. Please try again in 15 minutes.");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRevert = async () => {
        setResult(null);
        setJob("");
        setDifficulty("Easy");
        setInterviewType("Technical");

        const token = await getToken();
        if (!token) return;
        try {
            const res = await axios.get(`${API_BASE}/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to refresh history:", err);
        }
    };

    return (
        <div className="flex min-h-screen bg-black text-white">

            <Sidebar history={history} loading={historyLoading} />

            <div className="flex-1 flex flex-col items-center py-8 bg-dot-pattern">
                <div className={`fixed top-5 z-50 w-full flex justify-center transition-all duration-500 ease-in-out 
                ${showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
                >
                    <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900">
                        <AlertTriangleIcon />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                </div>

                {!loading && !result && (
                    <div className="flex flex-col items-center justify-center gap-5 p-10 animate-in fade-in duration-700">
                        <h1 className="text-4xl md:text-5xl text-center font-bold">AI Mock Interview</h1>
                        <p className="text-neutral-400 text-lg mb-5 text-center max-w-2xl">
                            Tailored questions and instant AI feedback for your next big role.
                        </p>

                        <div className="bg-black p-8 rounded-3xl border-2 border-neutral-600 shadow-2xl flex flex-col gap-8">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div>
                                    <label className="block mb-2 text-sm text-zinc-300 text-center uppercase tracking-wider">Job Role</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Frontend Developer"
                                        className="w-64 bg-neutral-800 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition text-zinc-200"
                                        value={job}
                                        onChange={(e) => setJob(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-zinc-300 text-center uppercase tracking-wider">Difficulty</label>
                                    <select
                                        className="w-64 bg-neutral-800 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition text-zinc-200"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-zinc-300 text-center uppercase tracking-wider">Type</label>
                                    <select
                                        className="w-64 bg-neutral-800 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition text-zinc-200"
                                        value={interviewType}
                                        onChange={(e) => setInterviewType(e.target.value)}
                                    >
                                        <option>Technical</option>
                                        <option>HR</option>
                                        <option>Behavioral</option>
                                        <option>System Design</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateClick}
                                className="py-4 px-12 bg-violet-600/80 hover:bg-violet-500/90 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 self-center"
                            >
                                Start Interview
                            </button>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh]">
                        <LoaderOne />
                        <p className="text-zinc-400 animate-pulse">Generating custom questions for {job}...</p>
                    </div>
                )}

                {result && (
                    <div className="w-full flex flex-col items-center animate-in slide-in-from-bottom-10 duration-700">
                        <Interview result={result} job={job} onRevert={handleRevert} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockInterview;