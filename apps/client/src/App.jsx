import './App.css'
import AllCoursesPage from './pages/AllCoursesPage.jsx'
import CourseDetailsPage from './pages/CourseDetailsPage.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <AllCoursesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:courseId" 
            element={
              <ProtectedRoute>
                <CourseDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-profile" 
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
      <Toaster />
    </>
  )
}

export default App
