const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Motorello Vehicle Service API',
      version: '1.0.0',
      description: 'API documentation for the Vehicle Service Platform',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
