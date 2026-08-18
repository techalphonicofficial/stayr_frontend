const fs = require('fs');
const path = require('path');

const swaggerPath = path.resolve('docs/swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Add Booking Paths
swaggerData.paths['/api/bookings'] = {
  post: {
    summary: 'Create a booking',
    tags: ['Bookings'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              propertyId: { type: 'string' },
              checkIn: { type: 'string', format: 'date-time' },
              checkOut: { type: 'string', format: 'date-time' },
              guestsCount: { type: 'integer' },
              specialRequests: { type: 'string' },
              bookingNotes: { type: 'string' }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Booking created',
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
      '400': { description: 'Validation error, overlap, or max guests exceeded' },
      '401': { description: 'Not authorized' },
      '404': { description: 'Property not found' }
    }
  }
};

swaggerData.paths['/api/bookings/me'] = {
  get: {
    summary: 'Get current user bookings',
    tags: ['Bookings'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    responses: {
      '200': {
        description: 'List of bookings',
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

swaggerData.paths['/api/bookings/host'] = {
  get: {
    summary: 'Get host bookings',
    tags: ['Bookings'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    responses: {
      '200': {
        description: 'List of host bookings',
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

swaggerData.paths['/api/bookings/{id}'] = {
  get: {
    summary: 'Get single booking',
    tags: ['Bookings'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'Booking details',
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
      '401': { description: 'Not authorized' },
      '403': { description: 'Forbidden access to this booking' },
      '404': { description: 'Booking not found' }
    }
  },
  delete: {
    summary: 'Cancel booking',
    tags: ['Bookings'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'Booking cancelled',
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
      '400': { description: 'Already cancelled or completed' },
      '401': { description: 'Not authorized' },
      '403': { description: 'Forbidden' },
      '404': { description: 'Booking not found' }
    }
  }
};

swaggerData.paths['/api/bookings/{id}/status'] = {
  put: {
    summary: 'Update booking status',
    tags: ['Bookings'],
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
              status: { type: 'string', enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'] }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Status updated',
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
      '400': { description: 'Validation or logic error' },
      '401': { description: 'Not authorized' },
      '403': { description: 'Forbidden' },
      '404': { description: 'Booking not found' }
    }
  }
};

swaggerData.paths['/api/properties/{id}/availability'] = {
  get: {
    summary: 'Check property availability',
    tags: ['Properties'],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      { name: 'checkIn', in: 'query', required: true, schema: { type: 'string', format: 'date-time' } },
      { name: 'checkOut', in: 'query', required: true, schema: { type: 'string', format: 'date-time' } }
    ],
    responses: {
      '200': {
        description: 'Availability check',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                available: { type: 'boolean' },
                conflictingBookings: { type: 'array', items: { type: 'object' } }
              }
            }
          }
        }
      },
      '400': { description: 'Missing dates' },
      '404': { description: 'Property not found' }
    }
  }
};

fs.writeFileSync(swaggerPath, JSON.stringify(swaggerData, null, 2));
