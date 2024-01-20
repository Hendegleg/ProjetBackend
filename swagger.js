const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Projet OSC",
            version: "0.1.0",
            description: "This is a Swagger Documentation of OSC API ",

        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Development server",
            },
        ],
    },
    apis: ["./routes/*.js"],
}

const specs = swaggerJsdoc(options)


module.exports = { specs, swaggerUi };