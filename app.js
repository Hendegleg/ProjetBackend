const express = require("express");
const mongoose = require("mongoose");
const oeuvreRoutes= require ("./routes/oeuvre")


mongoose
.connect(
     "mongodb://127.0.0.1:27017/database",
   { useNewUrlParser: true, useUnifiedTopology: true}
)
.then(()=>console.log("connexion a mongoDB reussite"))
.catch((e) =>console.log("connexion a mongoDB echouée", e))

const app = express();


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.json());

app.use("/api/oeuvres", oeuvreRoutes)



module.exports = app;
