import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const isLocalNoSSL =
  process.env.PGSSL === 'false' || process.env.NODE_ENV === 'development'

const config = {
  connectionString: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
  min: 0,
  maxUses: 1000,
  queueLimit: 0,
  acquireTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false, // Set to true in production
  },
  ssl: isLocalNoSSL ? false : { rejectUnauthorized: false },
}

export const pool = new pg.Pool(config)
