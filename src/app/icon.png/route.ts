import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png')
    const logoBuffer = fs.readFileSync(logoPath)
    
    return new NextResponse(logoBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    return new NextResponse('Icon not found', { status: 404 })
  }
}
