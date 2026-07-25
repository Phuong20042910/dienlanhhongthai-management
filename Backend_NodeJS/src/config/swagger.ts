import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Điện Lạnh Hồng Thái API',
      version: '1.0.0',
      description: 'Tài liệu API cho hệ thống quản lý nội bộ Điện Lạnh Hồng Thái',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Đường dẫn đến các file chứa comments mô tả API (vd: auth.routes.ts)
  apis: ['./src/routes/*.ts', './src/server.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
