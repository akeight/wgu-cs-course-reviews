import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const scriptPath = path.resolve(__dirname, 'setup.sql')

const resetDatabase = async () => {
  const sql = await readFile(scriptPath, 'utf-8')
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('Database reset success')
  } catch (error) {
    console.error('Error resetting database:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

resetDatabase()
