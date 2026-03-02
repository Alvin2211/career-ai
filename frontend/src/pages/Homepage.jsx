import Navbar from "../components/Navbar"
import { useUser } from "@clerk/clerk-react"
import { Upload } from "lucide-react";
import { useState, useRef } from "react";
import { LoaderOne} from "@/components/ui/loader";
import CareerResults from "../components/CareerResults";



const Homepage = () => {
    const { user } = useUser();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [careerResults, setCareerResults] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
        else {
            setSelectedFile(null);
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleSubmitClick = async () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", user?.id);
        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/uploadresume`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const datafetched = await response.json();
            if(response.ok){
                setCareerResults(datafetched.data.resumeData);
                console.log("Career options :", datafetched.data.resumeData);
            }
            else {
                alert("File upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <section className="relative  min-h-screen  overflow-hidden justify  ">
                <div className=" absolute inset-0  bg-[#0e0f11]" />
                <div className="container relative z-10 ">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-center mt-10 text-white">
                        Ready to Elevate Your{" "}
                        <span className="text-[#7c7cff] ]">
                            Career ?
                        </span>

                    </h1>

                    {!careerResults && !loading &&(
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center text-neutral-200 mb-5 ">
                        Tell us about yourself {user?.firstName}
                    </h2>
                    )}
                    <div className="flex items-center justify-center ">
                        {!careerResults && !loading && (
                            <div className=" m-5 lg:w-[50vw] md:w-[70vw] flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 
                                            rounded-xl p-10 cursor-pointer bg-neutral-300 hover:bg-neutral-200 transition-colors hover:scale-105 transition-transform duration-500">
                                <Upload size={55} className="text-[#7c7cff]" />

                                <p className="text-lg font-medium text-gray-800 mb-2">
                                    Upload Your Resume
                                </p>
                                <p className="text-sm text-gray-800 mb-6 text-center">
                                    Drag and drop file here, or click to select.<br />
                                    (PDF or DOCX)
                                </p>

                                <input type="file" id="resume-input" accept=".pdf,.docx" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                                {!selectedFile && (
                                    <button className=" px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold 
                        rounded-full shadow-lg shadow-indigo-500/50 transition-transform duration-150 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                                        onClick={handleButtonClick} >
                                        Browse Files
                                    </button>
                                )}
                                {selectedFile && (<div className="text-center">
                                    <p className="text-indigo-600 font-semibold mb-2 ">File Selected:
                                        <span className="text-gray-800 "> {selectedFile.name}</span>
                                    </p>
                                    <button className=" mt-2 px-5 py-3 bg-indigo-600 hover:indigo-700 text-white font-bold 
                                rounded-full shadow-md shadow-indigo-500/50 transition-transform duration-150 transform 
                                hover:scale-105 focus:outline-none "
                                        onClick={handleSubmitClick} >
                                        Submit
                                    </button>
                                </div>

                                )}
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col gap-10 items-center justify-center min-h-[50vh] z-10">
                            <LoaderOne  />
                            <p className="text-white mt-3 text-sm">Analyzing resume...</p>
                            </div>
                        )}
                    </div>

                </div>
                {careerResults && (
                    <CareerResults data={careerResults} />
                )}
            </section>
        </>
    )
}

export default Homepage
