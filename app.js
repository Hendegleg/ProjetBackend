const express = require("express");
const cron = require('node-cron');

require('dotenv').config();
const mongoose = require("mongoose");
const auditionRoutes = require("./routes/audition");
const repetitionRoutes = require("./routes/repetition");
const gererRoutes = require("./routes/gerercandidat");
const oeuvreRoutes= require ("./routes/oeuvre");
const candidatRoutes=require ("./routes/candidat");
const formulaireRoutes = require ("./routes/formulaire")
const congeRoutes = require('./routes/conge');
const saisonRoutes = require('./routes/saison.js');
const concertsRoutes = require('./routes/concert.js');
const qrcodeRoutes = require('./routes/qrcode');
const userRoutes = require('./routes/utilisateur.js')
const filtragecandidatRoutes= require('./routes/filtragecandidats.js')
const authRoutes = require ('./routes/auth');
const AbsenceRoutes = require ('./routes/absenceRequest')
const tessitureRoutes = require ('./routes/tessiture')
const intervenantRoutes = require ('./routes/intervenants')
const programmeRoutes= require('./routes/programme.js')
const pupitreRoutes = require('./routes/pupitre.js')
const eliminationRoutes = require ('./routes/elimination.js')
const repetitioncontroller = require ('./controllers/repetition')
const placementController = require('./routes/placement.js')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');


const {io}=require("./socket.js");

cron.schedule('29 13 * * *', repetitioncontroller.envoyerNotificationChoristes);
mongoose
.connect(
     "mongodb://127.0.0.1:27017/DS",
   { /*useNewUrlParser: true, useUnifiedTopology: true*/}
)
.then(()=>console.log("connexion a mongoDB reussite"))
.catch((e) =>console.log("connexion a mongoDB echouée", e))



const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
const options = {
  definition: {
    components: {
      responses: {
        200: {
          description: "Success",
        },
        400: {
          description: "Bad request. You may need to verify your information.",
        },
        401: {
          description: "Unauthorized request, you need additional privileges",
        },
        403: {
          description:
            "Forbidden request, you must login first. See /auth/login",
        },
        404: {
          description: "Object not found",
        },
        422: {
          description:
            "Unprocessable entry error, the request is valid but the server refused to process it",
        },
        500: {
          description: "Unexpected error, maybe try again later",
        },
      },

      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],

    openapi: '3.0.0',
    info: {
      title: 'API SWAGGER',
      version: '0.1.0',
      description: 'Description',
      contact: {
        name: 'Ghofrane',
        url: '',
        email: 'wechcriaghofrane@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use('/api/filtragecandidats', filtragecandidatRoutes);
app.use('/api/auditions', auditionRoutes);
app.use("/api/candidats", candidatRoutes);
app.use("/api/formulaires", formulaireRoutes);
app.use("/api/oeuvres", oeuvreRoutes);
app.use("/api/repetitions", repetitionRoutes);
app.use('/api/gerer', gererRoutes);
app.use('/api/conge', congeRoutes);
app.use('/api/absence',AbsenceRoutes)
app.use('/api/tessiture',tessitureRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/concert', concertsRoutes);
app.use('/api/saisons', saisonRoutes);
app.use("/api/programme",programmeRoutes)
app.use("/api/users",userRoutes)
app.use("/api/pupitre",pupitreRoutes)
app.use('/api/elimination',eliminationRoutes)
app.use('/api/intervenant',intervenantRoutes)
app.use('/api/placement', placementController)
module.exports = app;



