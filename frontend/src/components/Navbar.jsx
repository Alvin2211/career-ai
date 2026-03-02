import { useState,useEffect, use } from 'react';
import { Brain, Menu, X } from 'lucide-react';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { dark } from '@clerk/themes';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isSignedIn}=useUser();
  const navigate= useNavigate();
  useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    } 
  }, [isSignedIn, navigate]);


  return (
  <header className="sticky top-0 z-50 bg-[#0e0f11] backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4">

      <div className="flex items-center justify-between h-16">

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
            <Brain className="text-[#7c7cff] h-6 w-6 " />
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">
            Career<span className="text-[#7c7cff] text-xl">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex gap-10 text-sm text-neutral-400">
          {["Home", "Profile Builder", "Career Recommender", "AI Chat"].map((item) => (
            <a
              key={item}
              href="#"
              className="relative hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#7c7cff] hover:after:w-full after:transition-all"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:text-white transition">
                Sign In
              </button>
            </SignInButton>

            <SignInButton appearance={{theme:dark,}} mode="modal">
              <button className="px-5 py-2 rounded-lg bg-[#7c7cff] text-black font-medium hover:scale-105 transition">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className=" p-1">
              <UserButton appearance={{theme:dark,}} afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/10"
        >
          {isMenuOpen ? (
            <X className="text-white w-5 h-5" />
          ) : (
            <Menu className="text-white w-5 h-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-6 border-t border-white/10">
          <nav className="flex flex-col gap-4 mt-4 text-neutral-300">
            {["Home", "Profile", "Careers", "AI Chat"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                {item}
              </a>
            ))}

            <SignedOut>
              <SignInButton>
                <button className="w-full py-2 rounded-lg border border-white/10">
                  Sign In
                </button>
              </SignInButton>

              <SignInButton mode="modal">
                <button className="w-full py-2 rounded-lg bg-[#7c7cff] text-black font-medium">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
          </nav>
        </div>
      )}
    </div>
  </header>
);

};

export default Navbar;
