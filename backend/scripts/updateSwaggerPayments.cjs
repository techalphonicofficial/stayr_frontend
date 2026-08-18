const fs = require('fs');
const path = require('path');

const swaggerPath = path.resolve('docs/swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Add Payment Paths
swaggerData.paths['/api/payments/create-order'] = {
  post: {
    summary: 'Create Razorpay order for booking',
    tags: ['Payments'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              bookingId: { type: 'string' }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Order created successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: {
                  type: 'object',
                  properties: {
                    orderId: { type: 'string' },
                    amount: { type: 'number' },
                    currency: { type: 'string' },
                    booking: { type: 'string' },
                    paymentId: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      '400': { description: 'Booking already paid, cancelled, or completed' },
      '401': { description: 'Not authorized' },
      '403': { description: 'Not authorized to pay for this booking' },
      '404': { description: 'Booking not found' },
      '500': { description: 'Razorpay configuration error' }
    }
  }
};

swaggerData.paths['/api/payments/verify'] = {
  post: {
    summary: 'Verify Razorpay payment signature',
    tags: ['Payments'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              bookingId: { type: 'string' },
              razorpay_order_id: { type: 'string' },
              razorpay_payment_id: { type: 'string' },
              razorpay_signature: { type: 'string' }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Payment verified and booking confirmed',
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
      '400': { description: 'Invalid signature or already paid' },
      '401': { description: 'Not authorized' },
      '404': { description: 'Payment record not found' }
    }
  }
};

swaggerData.paths['/api/payments/refund'] = {
  post: {
    summary: 'Refund a Razorpay payment',
    tags: ['Payments'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              paymentId: { type: 'string' }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Refund processed successfully',
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
      '400': { description: 'Can only refund paid transactions' },
      '401': { description: 'Not authorized' },
      '403': { description: 'Not authorized to refund this payment' },
      '404': { description: 'Payment not found' },
      '500': { description: 'Razorpay configuration error' }
    }
  }
};

swaggerData.paths['/api/payments/me'] = {
  get: {
    summary: 'Get logged in user payments',
    tags: ['Payments'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    responses: {
      '200': {
        description: 'List of payments',
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

swaggerData.paths['/api/payments/host'] = {
  get: {
    summary: 'Get host payments',
    tags: ['Payments'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    responses: {
      '200': {
        description: 'List of payments for host properties',
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

swaggerData.paths['/api/payments/{id}'] = {
  get: {
    summary: 'Get single payment',
    tags: ['Payments'],
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
    ],
    responses: {
      '200': {
        description: 'Payment details',
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
      '403': { description: 'Not authorized to view this payment' },
      '404': { description: 'Payment not found' }
    }
  }
};

fs.writeFileSync(swaggerPath, JSON.stringify(swaggerData, null, 2));
