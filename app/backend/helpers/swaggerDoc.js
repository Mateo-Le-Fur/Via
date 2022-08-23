const path = require("path");

module.exports = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express API for Via application",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: [`${path.join(__dirname, "../routers/*.js")}`],
};
