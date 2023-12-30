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
const filtragecandidatRoutes= require('./routes/filtragecandidats.js')
const concertsRoutes= require('./routes/concert.js')
const qrcodeRoutes = require('./routes/qrcode');
const filtragecandidatRoutes= require('./routes/filtragecandidats.js')
const authRoutes = require ('./routes/auth');
const AbsenceRoutes = require ('./routes/absenceRequest')
const tessitureRoutes = require ('./routes/tessiture')
const saisonRoutes = require ('./routes/saison')
const pupitreRoutes = require ('./routes/pupitre')
const repetitioncontroller = require ('./controllers/repetition')
cron.schedule('08 19 * * *', repetitioncontroller.envoyerNotificationChoristes);


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
//app.use('/qrcode', qrcodeRoutes);

;
app.use('/api/saisons', saisonRoutes);
app.use('/api/pupitres', pupitreRoutes);





module.exports = app;



