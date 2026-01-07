import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from './config/passport.js'
import morgan from 'morgan'

import apiRoutes from './routes/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Trust the proxy
app.set('trust proxy', 1)

const allowedOrigins = [
  'http://localhost:5173',
  'https://wgu-cs-course-reviews-client.vercel.app',
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [])
]

// CORS must be configured at the top
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true)

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.warn('CORS blocked origin:', origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// HTTP request logger middleware for node.js
app.use(morgan('tiny'))

// Session configuration - MUST come before Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Always true for Render (uses HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'none', // Required for cross-origin cookies (frontend on different domain)
    },
  })
)

const isProd = process.env.NODE_ENV === 'production'
app.use(
  session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: isProd ? 'none' : 'lax',
  },
})
)

// Initialize Passport - MUST come after Session
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
