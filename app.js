const express = require("express");
const mongoose = require("mongoose");
const auditionRoutes = require("./routes/audition");





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



module.exports = app;
