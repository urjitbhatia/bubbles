import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from '../types/api'

// Create the API client
// baseUrl is empty because we proxy through Pages Functions
export const apiClient = createClient<paths>({
  baseUrl: '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth token middleware
let authToken: string | null = null

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    if (authToken) {
      request.headers.set('Authorization', `Bearer ${authToken}`)
    }
    return request
  },
}

apiClient.use(authMiddleware)

export function setAuthToken(token: string) {
  authToken = token
}

export function clearAuthToken() {
  authToken = null
}
