import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from './ui/spinner'

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-32 h-32" />
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
