import { NextResponse } from 'next/server'

export const runtime = "nodejs"

interface TestResult {
  name: string
  status: number | string
  ok: boolean
  error: string | null
  data?: any
}

export async function GET() {
  const results: {
    timestamp: string
    tests: TestResult[]
  } = {
    timestamp: new Date().toISOString(),
    tests: []
  }
  
  // Test 1: Prisma API
  try {
    const prismaRes = await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/orders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    results.tests.push({
      name: 'Prisma API',
      status: prismaRes.status,
      ok: prismaRes.ok,
      error: prismaRes.ok ? null : `HTTP ${prismaRes.status}`
    })
  } catch (error) {
    results.tests.push({
      name: 'Prisma API',
      status: 'ERROR',
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
  
  // Test 2: Neon API
  try {
    const neonRes = await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/orders-neon`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    results.tests.push({
      name: 'Neon API',
      status: neonRes.status,
      ok: neonRes.ok,
      error: neonRes.ok ? null : `HTTP ${neonRes.status}`
    })
  } catch (error) {
    results.tests.push({
      name: 'Neon API',
      status: 'ERROR',
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
  
  // Test 3: Health Check
  try {
    const healthRes = await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/health/db`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const healthData = await healthRes.json()
    
    results.tests.push({
      name: 'Health Check',
      status: healthRes.status,
      ok: healthRes.ok,
      data: healthData,
      error: healthRes.ok ? null : `HTTP ${healthRes.status}`
    })
  } catch (error) {
    results.tests.push({
      name: 'Health Check',
      status: 'ERROR',
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
  
  return NextResponse.json(results)
}
