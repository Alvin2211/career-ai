import { useAuth } from "@clerk/clerk-react";
import { LoaderOne } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import RoadmapViewer from "@/components/RoadmapViewer";

const GenRoadmap = () => {
  const { getToken } = useAuth();
  const [showError, setShowError] = useState(false);
  const [isResult, setIsResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleGenerateClick = async () => {
    const token = await getToken();
    if (!query || query.trim() === "" || query.length < 3 || query.length > 25) {
      setErrorMessage("Please enter a skill or job title between 3 and 25 characters.");
      setShowError(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/roadmap`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data) {
        setErrorMessage("Server error. Please try again later :) ");
        setShowError(true);
        return;
      }
      console.log("Roadmap response:", response.data);
      setIsResult(response.data.data);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      setErrorMessage("LLM services are temporarily down. Please try after 15 minutes :)");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-dot-pattern min-h-screen bg-black text-white py-8">

      <div
        className={`w-full flex justify-center transition-all duration-500 ease-in-out overflow-hidden
          ${showError ? "opacity-100 translate-y-0 max-h-40 mb-4" : "opacity-0 -translate-y-2 max-h-0"}`}
      >
        <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      </div>

      {!loading && !isResult && (
        <div className="flex flex-col items-center justify-center gap-10 p-10">
          <h1 className="text-4xl md:text-5xl text-center font-bold">
            Get a Structured Learning Path Tailored to Your Career Goals
          </h1>
          <div className="max-w-md mx-auto bg-neutral-900 mt-3 p-6 rounded-3xl shadow-xl border border-neutral-600">
            <p className="text-neutral-200 mb-6 text-md">
              Tell us what you want to learn and we'll create a clear, structured roadmap to guide your journey.
            </p>
            <div className="space-y-4 flex flex-col items-center justify-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Next.js, Kubernetes, Data Analytics..."
                className="w-full px-5 py-4 bg-neutral-800 border-2 border-transparent rounded-2xl
                  text-neutral-200 placeholder:text-neutral-500 outline-none transition-all duration-300"
              />
              <button
                onClick={handleGenerateClick}
                id="submit-btn"
                className="py-4 px-4 bg-[#7c7cff] hover:bg-[#7c7cff54] text-white font-semibold
                  rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Generate Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-10 items-center justify-center min-h-[50vh] z-10">
          <LoaderOne />
          <p className="text-white mt-3 text-sm">Generating Roadmap...</p>
        </div>
      )}

      {isResult && (
        <div className="flex flex-col items-center gap-6 px-4 pb-16">
          <div className="text-center pt-4">
            <h1 className="text-4xl md:text-5xl font-bold">Your Personalized Learning <span className="text-[#7c7cff]">Roadmap</span></h1>
          </div>
          <div className="w-full max-w-2xl z-10 bg-black/70  border-2 border-neutral-800  rounded-2xl ">
            <RoadmapViewer isResult={isResult} />
          </div>
          <button
            onClick={() => { setIsResult(null); setQuery(""); }}
            className="mt-4 text-sm text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
          >
            ← Generate a new roadmap
          </button>
        </div>
      )}

    </section>
  );
};

export default GenRoadmap;  