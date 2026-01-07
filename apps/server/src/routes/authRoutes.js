import { Router } from 'express'
import passport from '../config/passport.js'


const router = Router()

// Check if GitHub OAuth is configured
const isGitHubConfigured = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET

// Initiate GitHub OAuth flow
router.get('/github', (req, res, next) => {
  if (!isGitHubConfigured) {
    return res.status(503).json({ 
      error: 'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.' 
    })
  }
  // Store redirect path in session if provided
  if (req.query.redirect) {
    req.session.redirectAfterLogin = req.query.redirect
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next)
})

// GitHub OAuth callback
router.get('/github/callback', (req, res, next) => {
  console.log('GitHub callback received')
  
  if (!isGitHubConfigured) {
    console.error('GitHub OAuth not configured')
    return res.status(503).json({ 
      error: 'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.' 
    })
  }
  
  passport.authenticate('github', { 
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=auth_failed` 
  }, (err, user, info) => {
    if (err) {
      console.error('Auth error:', err)
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=auth_failed`)
    }
    if (!user) {
      console.error('No user returned from GitHub:', info)
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=auth_failed`)
    }
    
    console.log('User authenticated:', user.username)
    
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr)
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=auth_failed`)
      }
      console.log('User logged in successfully, redirecting...')
      
      // Get redirect path from session or default to home
      const redirectPath = req.session.redirectAfterLogin || '/'
      delete req.session.redirectAfterLogin // Clean up session
      
      // Successful authentication - redirect to original page
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
      return res.redirect(`${clientUrl}${redirectPath}?auth=success`)
    })
  })(req, res, next)
})

// Get current user session
router.get('/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user, authenticated: true })
  } else {
    res.json({ user: null, authenticated: false })
  }
})

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.json({ message: 'Logged out successfully' })
  })
})

export default router

