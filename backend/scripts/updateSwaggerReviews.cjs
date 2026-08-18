const fs = require('fs');
const path = require('path');

const swaggerPath = path.resolve('docs/swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Add Review Paths
swaggerData.paths['/api/reviews'] = {
  post: {
    summary: 'Create a review',
    tags: ['Reviews'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              bookingId: { type: 'string' },
              rating: { type: 'number', minimum: 1, maximum: 5 },
              comment: { type: 'string', maxLength: 1000 }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Review created',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'object' }
              }
            }
          }
        }
      },
      '400': { description: 'Validation error, incomplete booking, or duplicate' },
      '401': { description: 'Not authorized' },
      '403': { description: 'Not your booking' },
      '404': { description: 'Booking not found' }
    }
  }
};

swaggerData.paths['/api/reviews/property/{propertyId}'] = {
  get: {
    summary: 'Get all reviews for a property',
    tags: ['Reviews'],
    parameters: [
      { name: 'propertyId', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'List of reviews',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                count: { type: 'integer' },
                data: { type: 'array', items: { type: 'object' } }
              }
            }
          }
        }
      }
    }
  }
};

swaggerData.paths['/api/reviews/me'] = {
  get: {
    summary: 'Get logged in user reviews',
    tags: ['Reviews'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    responses: {
      '200': {
        description: 'List of my reviews',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                count: { type: 'integer' },
                data: { type: 'array', items: { type: 'object' } }
              }
            }
          }
        }
      },
      '401': { description: 'Not authorized' }
    }
  }
};

swaggerData.paths['/api/reviews/{id}'] = {
  get: {
    summary: 'Get single review',
    tags: ['Reviews'],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'Review details',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'object' }
              }
            }
          }
        }
      },
      '404': { description: 'Review not found' }
    }
  },
  put: {
    summary: 'Update review',
    tags: ['Reviews'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              rating: { type: 'number', minimum: 1, maximum: 5 },
              comment: { type: 'string', maxLength: 1000 }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Review updated',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'object' }
              }
            }
          }
        }
      },
      '400': { description: 'Validation error' },
      '401': { description: 'Not authorized' },
      '403': { description: 'Forbidden access' },
      '404': { description: 'Review not found' }
    }
  },
  delete: {
    summary: 'Delete review',
    tags: ['Reviews'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'Review deleted',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'object' },
                message: { type: 'string' }
              }
            }
          }
        }
      },
      '401': { description: 'Not authorized' },
      '403': { description: 'Forbidden access' },
      '404': { description: 'Review not found' }
    }
  }
};

fs.writeFileSync(swaggerPath, JSON.stringify(swaggerData, null, 2));
