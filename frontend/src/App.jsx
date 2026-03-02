import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Landingpage from './pages/Landingpage.jsx'
import Homepage from './pages/Homepage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
function App() {
  
  
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<ResumeBuilder />} />
        <Route path="/" element={<Landingpage/>}/>
      </Routes>
    </Router>
    
  )
}

export default App
