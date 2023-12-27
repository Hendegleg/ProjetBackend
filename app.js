const express = require("express");
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
const authRoutes = require ('./routes/auth');
const AbsenceRoutes = require ('./routes/absenceRequest')
const tessitureRoutes = require ('./routes/tessiture')
const saisonRoutes = require ('./routes/saison')
const concertRoutes=require('./routes/concert')
const programmeRoutes=require('./routes/programme')
const userRoutes=require('./routes/utilisateur')
const pupitreRoutes=require('./routes/pupitre')
const eliminationRoutes=require('./routes/elimination')

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


app.use('/api/filtragecandidats', filtragecandidatRoutes);
app.use('/api/auditions', auditionRoutes);
app.use("/api/candidats", candidatRoutes);
app.use("/api/formulaires", formulaireRoutes);
app.use("/api/oeuvres", oeuvreRoutes);
app.use("/api/repetitions", repetitionRoutes);
app.use('/api/gerer', gererRoutes);
app.use('/api/conge', congeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/absence', AbsenceRoutes)
app.use('/api/tessiture', tessitureRoutes);
app.use('/api/saisons', saisonRoutes);
app.use("/api/concerts",concertRoutes)
app.use("/api/programme",programmeRoutes)
app.use("/api/users",userRoutes)
app.use("/api/pupitre",pupitreRoutes)
app.use('/api/elimination',eliminationRoutes)
module.exports = app;



