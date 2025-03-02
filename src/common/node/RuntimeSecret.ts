import fs from 'node:fs'
import { config } from 'dotenv'

// Loads .env into process.env
const envFile = process.env.ENV_FILE ?? '.env'
config({ path: envFile })

export type RuntimeSecret =
    'GITHUB_PAT' |
    'AWS_ENDPOINT_URL' |
    'AWS_ACCESS_KEY_ID' |
    'AWS_SECRET_ACCESS_KEY'

export function getRuntimeSecret(key: RuntimeSecret): string {
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
