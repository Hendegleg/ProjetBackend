const express = require("express");
const mongoose = require("mongoose");
const auditionRoutes = require("./routes/audition");
const repetitionRoutes = require("./routes/repetition");
/*const mailerRoutes = require("./routes/mailer");*/


mongoose
.connect(
     "mongodb://127.0.0.1:27017/DS",
   { /*useNewUrlParser: true, useUnifiedTopology: true*/}
)
.then(()=>console.log("connexion a mongoDB reussite"))
.catch((e) =>console.log("connexion a mongoDB echouée", e))
const oeuvreRoutes= require ("./routes/oeuvre")
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

app.use("/api/oeuvres", oeuvreRoutes)
app.use("/api/repetitions", repetitionRoutes)
/*app.use('/mailer', mailerRoutes);*/


module.exports = app;
