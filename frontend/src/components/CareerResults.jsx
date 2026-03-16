import React from "react";
import { useNavigate } from "react-router-dom";

const CareerResults = ({ data }) => {
  const navigate = useNavigate();
  if (!data || !Array.isArray(data)) {
    return <p className="text-white text-center mt-10">No career results found.</p>;
  }
  return (
    <div className="relative z-10 mt-10 px-15 pb-15 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Suggested Career Paths
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {data.map((career, i) => (
          <div
            key={i}
            className="bg-black/50 backdrop-blur-md rounded-xl p-6 shadow-md  shadow-[#7c7cff] hover:scale-105 transition-transform duration-500"
          >
            <h3 className="text-xl font-bold text-[#7c7cff] ">
              {career.career_title} ({career.designation})
            </h3>

            <p className="mt-2 text-neutral-200 text-sm">
              {career.career_description}
            </p>

            {career.required_skills?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold text-[#7c7cff]">Required Skills:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {career.required_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 text-xs font-medium bg-white text-[#7c7cff] rounded-full "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {career.global_demand && (
              <p className="mt-3 text-sm text-[#7c7cff] italic">
                <strong >Global Demand:</strong> <span className="text-neutral-200">{career.global_demand}</span>
              </p>
            )}


            {career.related_jobs?.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold text-[#7c7cff]">Related Jobs:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {career.related_jobs.map((job, idx) => (
                      <span
                      key={idx}
                      className="px-3 py-2 text-xs font-medium bg-white text-[#7c7cff] rounded-full "
                    >{job}</span>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

        <button className=" mt-10 px-5 py-3 bg-[#7c7cff]  text-white font-semibold rounded-full shadow-md  shadow-indigo-500/50 hover:scale-105 transition-transform duration-200"
                          onClick={() => navigate('/careerrecommend')} >
                        Try Another Resume
        </button>
    </div>
  );
};

export default CareerResults;
