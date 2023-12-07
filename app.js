const express = require("express");
const mongoose = require("mongoose");
const auditionRoutes = require("./routes/audition");
const oeuvreRoutes= require ("./routes/oeuvre");
const candidatRoutes=require ("./routes/candidat");
const formulaireRoutes = require ("./routes/formulaire")


mongoose
  .connect("mongodb://127.0.0.1:27017/database",
  {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((e) => console.log("Connexion à MongoDB échouée", e));

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

app.use('/api/auditions', auditionRoutes);



app.use("/api/oeuvres", oeuvreRoutes);
app.use("/api/candidats", candidatRoutes);
app.use("/api/formulaires", formulaireRoutes);



module.exports = app;
