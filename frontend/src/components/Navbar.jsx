import { useState } from 'react';
import { Brain, Menu, X, Lock } from 'lucide-react';
import { UserButton, SignInButton, SignedIn, SignedOut, SignUpButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { dark } from '@clerk/themes';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Career Recommender', path: '/careerrecommend' },
    { label: 'Courses', path: '/courses' },
    { label: 'Roadmap Generator', path: '/roadmap' },
    { label: 'Mock Interviewer', path: '/interview' }
  ];

  const handleNavClick = (path) => {
  if (!isSignedIn) {
    navigate("/"); 
    return;
  }
  navigate(path);
};

  return (
    <header className=" bg-dot-pattern sticky top-0 z-50 bg-black backdrop-blur-md border-b border-white/10  ">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Brain className="text-[#7c7cff] h-6 w-6" />
            </div>
            <span className="text-lg font-semibold tracking-wide text-white">
              Career<span className="text-[#7c7cff] text-xl">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-10 text-sm text-neutral-400">
            {navItems.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => handleNavClick(path)}
                title={!isSignedIn ? 'Sign in to access this page' : label}
                className={`relative transition flex items-center gap-1
                  after:absolute after:left-0 after:-bottom-1 after:h-2px after:w-0 after:bg-[#7c7cff] after:transition-all
                  ${isSignedIn
                    ? 'hover:text-white hover:after:w-full cursor-pointer'
                    : 'hover:text-white hover:after:w-full cursor-pointer'

                  }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton
                mode="modal"
                forceRedirectUrl="/careerrecommend"
                appearance={{ theme: dark }}
              >
                <button className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:text-white transition">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton
                mode="modal"
                forceRedirectUrl="/careerrecommend"
                appearance={{ theme: dark }}
              >
                <button className="px-5 py-2 rounded-lg bg-[#7c7cff] text-black font-medium hover:scale-105 transition">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="p-1">
                <UserButton appearance={{ theme: dark }} />
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
            <nav className="flex flex-col gap-2 mt-4 text-neutral-300">
              {navItems.map(({ label, path }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(path)}
                  disabled={!isSignedIn}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition
                    ${isSignedIn
                      ? 'hover:bg-white/10 cursor-pointer'
                      : 'hover:bg-white/10 cursor-pointer'
                    }`}
                >
                  {label}
                </button>
              ))}
              
              <SignedIn>
                <div className="p-1">
                  <UserButton appearance={{ theme: dark }} />
                </div>
              </SignedIn>

              <SignedOut>
                <div className="mt-2 flex flex-col gap-2">
                  <SignInButton
                    forceRedirectUrl="/careerrecommend"
                    mode="modal"
                    appearance={{ theme: dark }}
                  >
                    <button className="w-full py-2 rounded-lg border border-white/10 hover:bg-white/10 transition">
                      Sign In
                    </button>
                  </SignInButton>

                  <SignUpButton
                    forceRedirectUrl="/careerrecommend"
                    mode="modal"
                    appearance={{ theme: dark }}
                  >
                    <button className="w-full py-2 rounded-lg bg-[#7c7cff] text-black font-medium hover:opacity-90 transition">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;