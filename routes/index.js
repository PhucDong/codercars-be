const express = require("express");
const router = express.Router();
const carsRouter = require("./cars.api");

router.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to cars database</h1>");
});

router.use("/cars", carsRouter);

module.exports = router;
