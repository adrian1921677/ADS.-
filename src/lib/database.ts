import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Neon-Datenbankverbindung
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Fallback für lokale Entwicklung
export const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Fallback für lokale Entwicklung
  return process.env.DATABASE_URL_UNPOOLED || 'postgresql://localhost:5432/ads_database'
}
