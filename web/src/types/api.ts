/**
 * Auto-generated API types from OpenAPI schema
 *
 * Run `pnpm run generate-types` to regenerate after backend changes
 * Requires backend to be running at http://localhost:9990
 */

// Placeholder types - regenerate with: pnpm run generate-types
export interface paths {
  '/api/v1/health': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              status: string
            }
          }
        }
      }
    }
  }
  '/api/v1/items': {
    get: {
      parameters: {
        query?: {
          page?: number
          limit?: number
        }
      }
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['ItemList']
          }
        }
      }
    }
    post: {
      requestBody: {
        content: {
          'application/json': components['schemas']['ItemCreate']
        }
      }
      responses: {
        201: {
          content: {
            'application/json': components['schemas']['Item']
          }
        }
      }
    }
  }
  '/api/v1/items/{item_id}': {
    get: {
      parameters: {
        path: {
          item_id: string
        }
      }
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['Item']
          }
        }
      }
    }
  }
  '/api/v1/user/profile': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['UserProfile']
          }
        }
      }
    }
  }
}

export interface components {
  schemas: {
    Item: {
      id: string
      name: string
      description?: string | null
      created_at: string
      user_id: string
    }
    ItemCreate: {
      name: string
      description?: string | null
    }
    ItemList: {
      items: components['schemas']['Item'][]
      total: number
      page: number
      limit: number
    }
    UserProfile: {
      id: string
      email: string
      full_name?: string | null
      created_at: string
    }
  }
}
