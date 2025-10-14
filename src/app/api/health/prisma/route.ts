import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const rid = `prisma_health_${Date.now()}`
  
  try {
    console.log(`[${rid}] Testing Prisma connection`)
    
    const result = await prisma.$queryRaw`select now() as ts, current_database() as db, current_schema() as schema`
    
    console.log(`[${rid}] Prisma connection successful:`, result)
    
    return NextResponse.json({ 
      ok: true, 
      rid,
      database: 'connected',
      driver: 'prisma',
      result: result,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error(`[${rid}] Prisma connection failed:`, {
      error: error?.message,
      stack: error?.stack,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
    })
    
    return NextResponse.json({ 
      ok: false, 
      rid,
      error: error?.message || 'Unknown database error',
      driver: 'prisma',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
