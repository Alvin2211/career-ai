import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Landingpage from './pages/Landingpage.jsx'
import Homepage from './pages/Homepage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import ProtectedRoute from './middlewares/ProtectedRoutes.jsx';
import Courses from './pages/Courses.jsx';
function App() {
  
  
  return (
    <Router>
  <Routes>
    <Route path="/" element={<Landingpage />} />

    <Route
      path="/careerrecommend"
      element={
        <ProtectedRoute>
          <Homepage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/builder"
      element={
        <ProtectedRoute>
          <ResumeBuilder />
        </ProtectedRoute>
      }
    />
    <Route
      path="/courses"
      element={
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      }
    />
  </Routes>
</Router>
    
  )
}

export default App
