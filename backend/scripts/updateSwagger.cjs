const fs = require('fs');
const path = require('path');

const swaggerPath = path.resolve('docs/swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Add Property Paths
swaggerData.paths['/api/properties'] = {
  get: {
    summary: 'Get all properties',
    tags: ['Properties'],
    parameters: [
      { name: 'page', in: 'query', schema: { type: 'integer' } },
      { name: 'limit', in: 'query', schema: { type: 'integer' } },
      { name: 'sort', in: 'query', schema: { type: 'string' } },
      { name: 'search', in: 'query', schema: { type: 'string' } },
      { name: 'minPrice', in: 'query', schema: { type: 'number' } },
      { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
      { name: 'category', in: 'query', schema: { type: 'string' } }
    ],
    responses: {
      '200': { description: 'Success' }
    }
  },
  post: {
    summary: 'Create a property',
    tags: ['Properties'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              category: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              country: { type: 'string' },
              pricePerNight: { type: 'number' },
              maxGuests: { type: 'number' },
              bedrooms: { type: 'number' },
              bathrooms: { type: 'number' }
            }
          }
        }
      }
    },
    responses: {
      '201': { description: 'Created' },
      '400': { description: 'Validation Error' },
      '401': { description: 'Not authorized' }
    }
  }
};

swaggerData.paths['/api/properties/{id}'] = {
  get: {
    summary: 'Get a single property',
    tags: ['Properties'],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': { description: 'Success' },
      '404': { description: 'Not found' }
    }
  },
  put: {
    summary: 'Update a property',
    tags: ['Properties'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object'
          }
        }
      }
    },
    responses: {
      '200': { description: 'Updated' },
      '401': { description: 'Not authorized' },
      '404': { description: 'Not found' }
    }
  },
  delete: {
    summary: 'Delete a property',
    tags: ['Properties'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': { description: 'Deleted' },
      '401': { description: 'Not authorized' },
      '404': { description: 'Not found' }
    }
  }
};

fs.writeFileSync(swaggerPath, JSON.stringify(swaggerData, null, 2));
