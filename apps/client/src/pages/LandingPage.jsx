import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import Header from '../components/Header'
import { Star, BookOpen, Users, TrendingUp, Github } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../hooks/useAuth'

export default function LandingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { authenticated, loading } = useAuth()

  // Handle auth callback
  useEffect(() => {
    const authStatus = searchParams.get('auth')
    if (authStatus === 'success') {
      // Redirect to courses page after successful login
      navigate('/courses')
    }
  }, [searchParams, navigate])

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && authenticated) {
      navigate('/courses')
    }
  }, [authenticated, loading, navigate])

  const handleLogin = () => {
    // Redirect to the server's GitHub OAuth endpoint
    window.location.href = API_ENDPOINTS.AUTH.GITHUB
  }

  // Don't show login buttons if already authenticated (will redirect anyway)
  // if (loading || authenticated) {
  //   return (
  //     <>
  //       <Header />
  //       <main className="container mx-auto px-4 py-16">
  //         <div className="max-w-4xl mx-auto text-center grid place-items-center min-vh-20">
  //           <Spinner className="w-32 h-32" />
  //         </div>
  //       </main>
  //     </>
  //   )
  // }
  
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Join WGU CS students sharing knowledge</span>
          </div>

          <h1 className="text-5xl">
            Your One-Stop Hub for
            <br />
            <span className="bg-gradient-to-r from-gray-700 to-gray-400 bg-clip-text text-transparent">
              WGU Course Reviews
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop searching through Reddit, Discord, and Facebook. Find honest
            reviews, ratings, study resources, and time estimates all in one
            place.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="gap-2 hover:cursor-pointer"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium">Honest Reviews</h3>
              <p className="text-muted-foreground">
                Read detailed reviews from students who've completed the
                courses. Real experiences, real insights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-700" />
              </div>
              <h3>Study Resources</h3>
              <p className="text-muted-foreground">
                Access curated study materials, helpful links, and resources
                shared by successful students.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
              <h3>Community Driven</h3>
              <p className="text-muted-foreground">
                Upvote helpful reviews, contribute your own experiences, and
                help future students succeed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-linear-to-r from-blue-800 to-blue-900 p-8 rounded-2xl text-white">
            <h2 className="text-white mb-3">Ready to get started?</h2>
            <p className="text-blue-100 mb-6 max-w-md">
              Join thousands of WGU CS students making informed course decisions
            </p>
            <Button
              onClick={handleLogin}
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              <Github className="w-5 h-5" />
              Sign in with GitHub
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-7 bg-white/50">
        <div className="container mx-auto px-3 text-center text-sm text-muted-foreground">
          <p>Made with ❤️💻 by WGU CS students, for WGU CS students</p>
          <p className="mt-2">
            Not affiliated with Western Governors University
          </p>
        </div>
      </footer>
    </>
  )
}
