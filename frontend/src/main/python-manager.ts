import { spawn, execSync, type ChildProcess } from 'node:child_process'
import path from 'node:path'
import http from 'node:http'

let pythonProcess: ChildProcess | null = null
let currentPort = 8000

const MAX_PORT_ATTEMPTS = 10
const BACKEND_DIR = path.join(__dirname, '../../../backend')

function findPython3(): string {
  const candidates = [
    'python3',
    '/usr/local/bin/python3',
    '/opt/homebrew/bin/python3',
    '/usr/bin/python3'
  ]
  for (const cmd of candidates) {
    try {
      execSync(`${cmd} --version`, { stdio: 'ignore' })
      return cmd
    } catch {
      // continue
    }
  }
  return 'python3'
}

function getShellPath(): string {
  try {
    return execSync('/bin/bash -ilc "echo $PATH"', { encoding: 'utf-8' }).trim()
  } catch {
    return process.env.PATH || ''
  }
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.request({ host: 'localhost', port, path: '/health', timeout: 500 }, () =>
      resolve(false)
    )
    req.on('error', () => resolve(true))
    req.end()
  })
}

async function findAvailablePort(startPort: number): Promise<number> {
  for (let i = 0; i < MAX_PORT_ATTEMPTS; i++) {
    const port = startPort + i
    const available = await isPortAvailable(port)
    if (available) return port
  }
  throw new Error(`No available port found starting from ${startPort}`)
}

function waitForServer(port: number, maxRetries = 30): Promise<void> {
  return new Promise((resolve, reject) => {
    let retries = 0
    const check = (): void => {
      const req = http.request(
        { host: 'localhost', port, path: '/health', timeout: 1000 },
        (res) => {
          if (res.statusCode === 200) {
            resolve()
          } else if (retries < maxRetries) {
            retries++
            setTimeout(check, 500)
          } else {
            reject(new Error('Server failed to respond'))
          }
        }
      )
      req.on('error', () => {
        if (retries < maxRetries) {
          retries++
          setTimeout(check, 500)
        } else {
          reject(new Error('Server failed to start'))
        }
      })
      req.end()
    }
    check()
  })
}

export async function startPythonBackend(): Promise<number> {
  currentPort = await findAvailablePort(8000)
  const pythonCmd = findPython3()
  const shellPath = getShellPath()

  console.log(`[Backend] Using python: ${pythonCmd}`)
  console.log(`[Backend] BACKEND_DIR: ${BACKEND_DIR}`)

  pythonProcess = spawn(
    pythonCmd,
    ['-m', 'uvicorn', 'main:app', '--host', 'localhost', '--port', String(currentPort)],
    {
      cwd: BACKEND_DIR,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PATH: shellPath || process.env.PATH }
    }
  )

  pythonProcess.on('error', (err) => {
    console.error(`[Backend] Failed to spawn: ${err.message}`)
    pythonProcess = null
  })

  pythonProcess.stdout?.on('data', (data: Buffer) => {
    console.log(`[Backend] ${data.toString()}`)
  })
  pythonProcess.stderr?.on('data', (data: Buffer) => {
    console.error(`[Backend] ${data.toString()}`)
  })
  pythonProcess.on('exit', (code) => {
    console.log(`[Backend] Process exited with code ${code}`)
    pythonProcess = null
  })

  await waitForServer(currentPort)
  console.log(`[Backend] Server running on port ${currentPort}`)
  return currentPort
}

export function stopPythonBackend(): void {
  if (pythonProcess) {
    pythonProcess.kill('SIGTERM')
    pythonProcess = null
    console.log('[Backend] Server stopped')
  }
}

export function getBackendPort(): number {
  return currentPort
}
