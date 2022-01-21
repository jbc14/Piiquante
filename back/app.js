const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require("path");

mongoose
  .connect(
    "mongodb+srv://jbc14:tByuWRrxL7Y6DCvr@cluster0.lni6s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
