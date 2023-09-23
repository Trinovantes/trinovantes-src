import { ErrorResponse } from '@/api/schemas/ApiResponse'
import { ErrorRequestHandler } from 'express'
import { HttpError } from 'http-errors'

export function createErrorHandler(isJsonResponse: boolean): ErrorRequestHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (err, req, res, next) => {
        console.error(err)

        let errorMessage: string
        let status = 500

        if (err instanceof HttpError) {
            errorMessage = err.message
            status = err.status
        } else {
            errorMessage = 'Internal Server Error'
        }

        if (isJsonResponse) {
            res.status(status)
            res.json({ status, errorMessage } satisfies ErrorResponse)
        } else {
            res.status(status)
            res.send(`<pre>${errorMessage}</pre>`)
        }
    }
}
