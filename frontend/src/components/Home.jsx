import { Sparkles } from "lucide-react";
import img1 from "../images/img1.jpg";

const Home = () => {
  return (
    <section className=" relative min-h-screen overflow-hidden pt-24">


      <div className="bg-dot-pattern absolute inset-0 z-10 bg-black" />

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm text-white backdrop-blur-md mb-8">
              <Sparkles className="w-4 h-4 text-[#7c7cff]" />
              AI Powered Career Guidance
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
              Discover Your Perfect{" "}
              <span className="text-[#7c7cff]">Career Path</span>
            </h1>

            <p className="text-lg text-neutral-400 max-w-xl mb-10">
              Get personalized career insights, skill gap analysis, and AI-powered
              roadmaps designed to shape your future.
            </p>

            <div className="flex flex-wrap gap-5">
              <button onClick={() => {
                if (isSignedIn) navigate("/careerrecommend");
                else navigate("/"); 
              }} className="px-8 py-3 rounded-lg bg-[#7c7cff] text-black font-medium hover:scale-105 transition">
                Start Your Journey →
              </button>

              <button className="px-8 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#7c7cff]/20 blur-3xl rounded-full"></div>

            <img
              src={img1}
              alt="Career AI"
              className="relative z-10 rounded-2xl shadow-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );

};

export default Home;
