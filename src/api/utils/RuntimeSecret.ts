import fs from 'fs'
import { config } from 'dotenv'

// Loads .env into process.env
config()

export enum RuntimeSecret {
    GITHUB_PAT = 'GITHUB_PAT',

    AWS_ENDPOINT_URL = 'AWS_ENDPOINT_URL',
    AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
    AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
}

export function getRuntimeSecret(key: string): string {
    // Check if it's already defined in process.env
    const envValue = process.env[key]
    if (envValue) {
        return envValue
    }

    // Check if it exists as a runtime secret via Docker
    const secretsFile = `/run/secrets/${key}`
    if (fs.existsSync(secretsFile)) {
        const secret = fs.readFileSync(secretsFile)
        return secret.toString('utf-8')
    }

    // Cannot find the secret anywhere
    throw new Error(`Cannot find ${key}`)
}
