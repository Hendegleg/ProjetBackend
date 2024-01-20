const express = require("express");
const cron = require('node-cron');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
const pupitreRoutes = require ('./routes/pupitre')
const repetitioncontroller = require ('./controllers/repetition')
cron.schedule('22 20 * * *', repetitioncontroller.envoyerNotificationChoristes);
const programmeRoutes=require('./routes/programme')

const intervenantRoutes = require ('./routes/intervenants')

const eliminationRoutes = require ('./routes/elimination.js')
const {io}=require("./socket.js");
const { notifiercongechoriste }= require('./controllers/conge.js')
cron.schedule('58 18 * * *', async () => {
  const liste = await notifiercongechoriste();

  if (liste) {
  
    io.emit("notif-6582068777dd44c527da3a08", { message: "Demandes de congé des choristes", liste });
  }
});




mongoose
.connect(
     "mongodb://127.0.0.1:27017/database",
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

//app.use('/confirmation', confirmationRoutes);
//app.use('/qrcode', qrcodeRoutes);
app.use('/api/auth',authRoutes)
app.use('/api/concert', concertsRoutes);
app.use('/api/saisons', saisonRoutes);
app.use("/api/programme",programmeRoutes)
app.use("/api/users",userRoutes)
app.use("/api/pupitre",pupitreRoutes)
app.use('/api/elimination',eliminationRoutes)
app.use('/api/intervenant',intervenantRoutes)
module.exports = app;



