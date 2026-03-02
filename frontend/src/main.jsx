import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
const CLERK_PUB_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ClerkProvider publishableKey={CLERK_PUB_KEY}>
    <App />
  </ClerkProvider>
  </StrictMode>
)
