import fs from 'fs/promises'
import path from 'path'

export async function isSetupRequired(): Promise<boolean> {
  try {
    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local')
    await fs.access(envPath)
    
    // Check if OPENCLAW_WORKSPACE is set
    if (!process.env.OPENCLAW_WORKSPACE) {
      return true
    }
    
    return false
  } catch {
    // .env.local doesn't exist
    return true
  }
}

export async function checkSetupStatus() {
  const setupRequired = await isSetupRequired()
  
  return {
    setupRequired,
    hasEnvFile: !setupRequired,
    workspacePath: process.env.OPENCLAW_WORKSPACE || null,
    configPath: process.env.OPENCLAW_CONFIG || null
  }
}