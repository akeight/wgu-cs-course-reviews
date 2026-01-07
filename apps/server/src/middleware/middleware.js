// Middleware common patterns
import { validateRow } from './validation.js'

export function logger(req, res, next) {
  console.log('Request received')
  next()
}

// Route handler example
app.post('/api/rows', logger, validateRow, (req, res) => {
  // Runs only if validateRow calls next()
  res.json({ message: 'Success' })
})

export { validateRow, logger }
