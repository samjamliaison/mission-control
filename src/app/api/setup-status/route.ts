import { NextResponse } from 'next/server'
import { checkSetupStatus } from '@/lib/setup-check'

export async function GET() {
  try {
    const status = await checkSetupStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error('Setup status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check setup status' },
      { status: 500 }
    )
  }
}