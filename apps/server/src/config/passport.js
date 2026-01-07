import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })


// Configure Passport to use GitHub OAuth (only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.local`
          const username = profile.username
          const avatar = profile.photos?.[0]?.value || null
          
          // Check if user exists in database or creates it
          let result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
          )
          
          let user
          if (result.rows.length > 0) {
            // User exists, use their database id
            user = result.rows[0]
          } else {
            // Creates user if not found
            result = await pool.query(
              'INSERT INTO users (email, username, avatar) VALUES ($1, $2, $3) RETURNING *',
              [email, username, avatar]
            )
            user = result.rows[0]
          }
          
          // Return user with database id and github profile info
          return done(null, {
            id: user.id, // database id
            email: user.email,
            username: user.username,
            githubId: profile.id, // github id for reference
            avatar: profile.photos?.[0]?.value,
            displayName: profile.displayName || profile.username,
          })
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )
  console.log('✅ GitHub OAuth strategy configured')
} else {
  console.warn('⚠️  GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env to enable authentication.')
}

// Stores database user id in session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Finds user from the session in the database
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    if (result.rows.length > 0) {
      done(null, result.rows[0])
    } else {
      done(new Error('User not found'), null)
    }
  } catch (error) {
    done(error, null)
  }
})

export default passport

