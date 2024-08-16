const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MONGODB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`DB connected to ${MONGO_URI}`))
  .catch((err) => console.log(err));

app.use("/", indexRouter);

module.exports = app;
