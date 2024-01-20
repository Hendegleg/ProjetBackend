const express = require("express");
const cron = require('node-cron');
const socketIO = require('socket.io');
require('dotenv').config();
const mongoose = require("mongoose");
const userRoutes =require("./routes/utilisateur");
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
const AbsenceRoutes = require ('./routes/absenceRequest.js')
const tessitureRoutes = require ('./routes/tessiture')
const intervenantRoutes = require ('./routes/intervenants')
const programmeRoutes= require('./routes/programme.js')
const pupitreRoutes = require('./routes/pupitre.js')
const eliminationRoutes = require ('./routes/elimination.js')
const repetitioncontroller = require ('./controllers/repetition');
const { notifieradmin } = require("./controllers/candidat.js");
const placementController = require('./routes/placement.js')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');


const {io}=require("./socket.js");
const programmeRoutes= require('./routes/programme.js')
const pupitreRoutes = require('./routes/pupitre.js')
const eliminationRoutes = require ('./routes/elimination.js')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');
const {io}=require("./socket.js");
const { notifieradminChoristeseliminés }= require('./controllers/absenceElemination.js')

cron.schedule('29 13 * * *', repetitioncontroller.envoyerNotificationChoristes);

cron.schedule('09 05 * * *',async () => {
const liste = await notifieradmin();
  if (liste){
    io.emit("notif-65a8472046fcf3fd1485d808", {message :"liste des candidatures", liste });
  }
});

cron.schedule('24 23 * * *', async () => {
  try {
    const liste = await notifieradminChoristeseliminés();

    if (liste && liste.length > 0) {
      io.emit("notif-658952ad8759379e4f8bbeac", { message: "Listes des choristes eliminés", liste });
    } else {
      console.log("Aucun choriste éliminé trouvé.");
    }
  } catch (error) {
    console.error(error.message);
  }
});
const { notifierNominés }= require('./controllers/absenceElemination.js')
cron.schedule('55 23 * * *', async () => {
  try {
    const liste = await  notifierNominés();

    if (liste && liste.length > 0) {
      io.emit("notif-nominés", { message: "Listes des choristes nominés", liste });
    } 
  } catch (error) {
    console.error(error.message);
  }
});

const { notifierElimines }= require('./controllers/absenceElemination.js')
cron.schedule('58 23 * * *', async () => {
  try {
    const liste = await  notifierElimines();

    if (liste && liste.length > 0) {
      io.emit("notifierElimines", { message: "Listes des choristes eliminés", liste });
    } 
  } catch (error) {
    console.error(error.message);
  }
});
const {io}=require("./socket.js");
const { notifieradminChoristeseliminés }= require('./controllers/absenceElemination.js')
cron.schedule('24 23 * * *', async () => {
  try {
    const liste = await notifieradminChoristeseliminés();

    if (liste) {
      io.emit("notif-6582068777dd44c527da3a08", { message: "Demandes de congé des choristes", liste });
    }
  } catch (error) {
    console.error("Erreur dans le planificateur cron:", error.message);
  }
});


cron.schedule('29 13 * * *', repetitioncontroller.envoyerNotificationChoristes);
mongoose
.connect(
     "mongodb://127.0.0.1:27017/projet",
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


app.use("/api/concerts", concertsRoutes);
app.use('/api/filtragecandidats', filtragecandidatRoutes);
app.use('/api/auditions', auditionRoutes);
app.use("/api/candidats", candidatRoutes);
app.use("/api/formulaires", formulaireRoutes);
app.use("/api/oeuvres", oeuvreRoutes);
app.use("/api/repetitions", repetitionRoutes);
app.use('/api/gerer', gererRoutes);
app.use('/api/conge', congeRoutes);
//app.use('/confirmation', confirmationRoutes);
app.use('/qrcode', qrcodeRoutes);
app.use('/api/absence',AbsenceRoutes)
app.use('/api/tessiture',tessitureRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/concert', concertsRoutes);
app.use('/api/concert', concertsRoutes);
app.use('/api/saisons', saisonRoutes);
app.use("/api/programme",programmeRoutes)
app.use("/api/users",userRoutes)
app.use("/api/pupitre",pupitreRoutes)
app.use('/api/elimination',eliminationRoutes)
app.use('/api/intervenant',intervenantRoutes)
app.use('/api/placement', placementController)
app.use('/api/pupitres', pupitreRoutes);

app.use('/api/intervenant',intervenantRoutes)

module.exports = app;
module.exports.io = io;




