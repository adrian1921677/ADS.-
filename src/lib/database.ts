import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Neon-Datenbankverbindung mit Fallback
const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_7zDcWk6VsmPt@ep-lucky-river-ag110etn-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const sql = neon(databaseUrl)
export const db = drizzle(sql)

// Fallback für lokale Entwicklung
export const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Fallback für lokale Entwicklung
  return process.env.DATABASE_URL_UNPOOLED || 'postgresql://localhost:5432/ads_database'
}
