import Landingpage from './pages/Landingpage.jsx'
import Homepage from './pages/Homepage.jsx'
import Courses from './pages/Courses.jsx';
import Roadmap from './pages/Roadmap.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './middlewares/ProtectedRoutes.jsx';
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
      path="/courses"
      element={
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      }
    />
    <Route
      path="/roadmap"
      element={
        <ProtectedRoute>
          <Roadmap />
        </ProtectedRoute>
      }
    />
  </Routes>
</Router>
    
  )
}

export default App
