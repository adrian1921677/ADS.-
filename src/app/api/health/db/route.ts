import { NextResponse } from "next/server"

export const runtime = "nodejs" // Erzwinge Node Runtime

export async function GET() {
  const rid = `health_${Date.now()}`
  
  try {
    // Prisma Health Check
    const { prisma } = await import('@/lib/prisma')
    
    // Teste die Verbindung mit einer einfachen Query
    const result = await prisma.$queryRaw`SELECT current_database() as db, current_schema() as schema, now() as timestamp`
    
    return NextResponse.json({ 
      ok: true, 
      rid,
      database: 'connected',
      result: result,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('DATABASE_HEALTH_CHECK_FAILED', { rid, error: error?.message })
    
    return NextResponse.json({ 
      ok: false, 
      rid,
      error: error?.message || 'Unknown database error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
