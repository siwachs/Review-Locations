const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const placesRoutes = require("./routes/places_routes");
const usersRoutes = require("./routes/users_routes");
const HttpError = require("./models/http_error");

const app = express();

app.use(body_parser.json());

//grant access for images
app.use("/uploads/images", express.static(path.join("uploads", "images")));

//handle CORS Error
app.use((req, res, next) => {
  //add headers to response
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

//MiddleWares Registration //use POST or GET
app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

//default Error handler
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//Error Handler
app.use((error, req, res, next) => {
  if (req.file) {
    //added by Multer use fs module
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An error occur" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h0e4g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => {
    console.log("Server Connection" + error);
  });
