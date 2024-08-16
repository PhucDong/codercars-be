const express = require("express");
const {
  createCar,
  getAllCars,
  editCar,
  deleteCar,
} = require("../controllers/cars.controller");
const router = express.Router();

// CREATE
router.post("/", createCar);

// READ
router.get("/", getAllCars);

// UPDATE
router.put("/:carId", editCar);

// // DELETE
router.delete("/:carId", deleteCar);

module.exports = router;
