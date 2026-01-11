import { Button } from '../components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

export default function Header() {
  const { user, logout, authenticated, authenticate, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const avatarUrl = user?.avatar || null;
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const handleLogin = () => {
    // Redirect to the server's GitHub OAuth endpoint
    window.location.href = API_ENDPOINTS.AUTH.GITHUB
  }

  // Show back button only on CourseDetailsPage and UserProfilePage
  const showBackButton = location.pathname.startsWith('/courses/') || location.pathname === '/user-profile'

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button variant="ghost" className="w-10 h-10" asChild>
                <Link to="/courses">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
              </Button>
            )}
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white hover:cursor-default text-2xl font-bold scroll-m-20">W</span>
            </div>
            <div>
              <span
                 className="text-[#0A0A0A] leading-6 tracking-[-0.312px] hover:cursor-default"
              >
                WGU CS Reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-3">
              {/* <Button variant="ghost" asChild>
                <Link to="/courses">All Courses</Link>
              </Button> */}
            
            {loading ? (
              <div className="w-[96px] h-10" />
            ) : authenticated ? (
              <>
                <Button variant="outline" className="gap-2 hover:cursor-pointer" onClick={logout}>
                  Sign Out
                </Button>
                <Link to="/user-profile" className="inline-flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:ring-2 hover:ring-ring">
                  <Avatar>
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{getInitials(user?.displayName || user?.username)}</AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <Button variant="outline" className="gap-2 hover:cursor-pointer" onClick={authenticate}>
                Sign In
              </Button>
            )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
