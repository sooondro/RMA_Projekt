const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes.js");

const MONGODB_URI =
  "mongodb+srv://sandro:z6hE16hJP6wXx0zl@cluster0.zutnl.mongodb.net/RMA-projekt";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({
    confirmation: "fail",
    message: message,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
