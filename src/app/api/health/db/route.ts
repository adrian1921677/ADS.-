import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const runtime = "nodejs" // Erzwinge Node Runtime

export async function GET() {
  const rid = `health_${Date.now()}`
  
  try {
    console.log(`[${rid}] Testing Neon connection with @neondatabase/serverless`)
    
    // Prüfe NEON_HTTP_URL Format
    const dbUrl = process.env.NEON_HTTP_URL || process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error('NEON_HTTP_URL not set')
    }
    
    if (!dbUrl.startsWith('postgresql://')) {
      throw new Error('NEON_HTTP_URL must start with postgresql:// (not postgres://)')
    }
    
    if (dbUrl.includes('-pooler.')) {
      throw new Error('NEON_HTTP_URL contains -pooler which is not compatible with @neondatabase/serverless')
    }
    
    // Direkte Neon-Verbindung testen
    const sql = neon(dbUrl)
    const rows = await sql`select now() as ts, current_database() as db, current_schema() as schema`
    
    console.log(`[${rid}] Neon connection successful:`, rows)
    
    return NextResponse.json({ 
      ok: true, 
      rid,
      database: 'connected',
      driver: '@neondatabase/serverless',
      rows: rows,
      urlFormat: 'correct',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error(`[${rid}] Neon connection failed:`, {
      error: error?.message,
      stack: error?.stack,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      urlFormat: process.env.DATABASE_URL?.startsWith('postgresql://') ? 'postgresql' : 'other'
    })
    
    return NextResponse.json({ 
      ok: false, 
      rid,
      error: error?.message || 'Unknown database error',
      driver: '@neondatabase/serverless',
      urlFormat: process.env.DATABASE_URL?.startsWith('postgresql://') ? 'postgresql' : 'other',
      hasPooler: process.env.DATABASE_URL?.includes('-pooler.') ? 'YES' : 'NO',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
