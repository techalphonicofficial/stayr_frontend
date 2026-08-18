const fs = require('fs');
const path = require('path');

const swaggerPath = path.resolve('docs/swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Add Property Images Paths
swaggerData.paths['/api/properties/{id}/images'] = {
  post: {
    summary: 'Upload property images',
    tags: ['Property Images'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary'
                },
                description: 'Up to 10 images'
              }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Images uploaded',
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
      '400': { description: 'Validation Error or limit exceeded' },
      '401': { description: 'Not authorized' },
      '404': { description: 'Property not found' }
    }
  },
  get: {
    summary: 'Get all property images',
    tags: ['Property Images'],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'Success',
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
      '404': { description: 'Property not found' }
    }
  }
};

swaggerData.paths['/api/properties/{id}/images/{imageId}'] = {
  delete: {
    summary: 'Delete a single property image',
    tags: ['Property Images'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      { name: 'imageId', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'Image deleted',
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
      '404': { description: 'Property or image not found' }
    }
  }
};

swaggerData.paths['/api/properties/{id}/featured-image'] = {
  put: {
    summary: 'Set featured image',
    tags: ['Property Images'],
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
              imageId: { type: 'string' }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Featured image set',
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
      '400': { description: 'Validation Error' },
      '401': { description: 'Not authorized' },
      '404': { description: 'Property or image not found' }
    }
  }
};

fs.writeFileSync(swaggerPath, JSON.stringify(swaggerData, null, 2));
