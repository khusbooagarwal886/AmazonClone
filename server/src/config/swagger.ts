import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { ENV } from './env';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Amazon Clone API',
      version: '1.0.0',
      description:
        'RESTful API documentation for Amazon Clone backend (Express, TypeScript, MongoDB, Redis, Stripe, JWT)',
    },
    servers: [
      {
        url: ENV.SERVER_URL,
        description:
          ENV.NODE_ENV === 'production' ? 'Production Server' : 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token to authorize requests',
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, '../routes/*.ts').replace(/\\/g, '/'),
    path.resolve(__dirname, '../routes/*.js').replace(/\\/g, '/'),
    path.resolve(__dirname, '../index.ts').replace(/\\/g, '/'),
    path.resolve(__dirname, '../index.js').replace(/\\/g, '/'),
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
