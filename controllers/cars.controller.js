const mongoose = require("mongoose");
const { handleError } = require("../utils/handleError");
const { handleResponse } = require("../utils/handleResponse");
const Car = require("../models/Car");
const { ObjectId } = mongoose.Types;

const carsController = {};

function lowerCaseAndFormatKeys(obj) {
  if (typeof obj !== "object") {
    throw new Error("You must provide an object to lowercase keys");
  }

  return Object.entries(obj).reduce((carry, [key, value]) => {
    if (key.toLowerCase() === "release_date" || key.toLowerCase() === "price") {
      carry[key.toLowerCase()] = parseInt(value);
    } else {
      carry[key.toLowerCase()] = value;
    }

    return carry;
  }, {});
}

// Step 1: validate inputs
// Step 2: process logic
// Step 3: send response
carsController.createCar = async (req, res, next) => {
  try {
    const { make, model, release_date, transmission_type, price, size, style } =
      req.body;

    if (
      !make ||
      !model ||
      !release_date ||
      !transmission_type ||
      !price ||
      !size ||
      !style
    ) {
      throw handleError("Missing body information.", 500);
    }

    const newCar = {
      make,
      model,
      release_date,
      transmission_type,
      price,
      size,
      style,
      isDeleted: false,
    };

    const result = await Car.create(newCar);
    const addedCar = {};
    addedCar.message = "Create a car successfully!";
    addedCar.car = result;

    handleResponse(res, addedCar);
  } catch (error) {
    next(error);
  }
};

carsController.getAllCars = async (req, res, next) => {
  const allowedQueryList = [
    "make",
    "model",
    "release_date",
    "transmission_type",
    "price",
    "size",
    "style",
  ];

  try {
    let { page, limit, ...filterQueries } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterKeyList = Object.keys(filterQueries).map((key) =>
      key.toLowerCase()
    );

    filterKeyList.map((key) => {
      if (!allowedQueryList.includes(key)) {
        throw handleError(`Query ${key} is not allowed.`, 401);
      }

      if (!filterQueries[key]) delete filterQueries[key];
    });

    const newFilterQueries = lowerCaseAndFormatKeys(filterQueries);

    // Traditional way to paginate results
    // const offset = limit * (page - 1);
    // const foundCarList = await Car.find(newFilterQueries);

    // let totalPages = 0;
    // let data = {};
    //   data.totalPages = Math.floor(foundCarList.length / limit);
    //   data.cars = foundCarList.slice(offset, offset + limit);

    // Paginate results with aggregate framework

    const foundCarList = await Car.aggregate([
      {
        $match: newFilterQueries, // Add filter queries here
      },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          otherData: [
            { $count: "totalCars" },
            {
              $addFields: {
                // Calculate total pages
                totalPages: {
                  $ceil: {
                    $divide: ["$totalCars", limit],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    if (foundCarList.length === 0) {
      throw handleError("Car can't be found.", 404);
    }

    const response = {
      message: "Get cars successfully!",
      cars: foundCarList[0]?.data,
      page: page,
      total: foundCarList[0]?.otherData[0]?.totalPages,
    };

    handleResponse(res, response);
  } catch (error) {
    next(error);
  }
};

carsController.editCar = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const updateList = req.body;

    const foundCar = await Car.findByIdAndUpdate(
      { _id: ObjectId(carId) },
      updateList,
      { new: true }
    );

    if (!foundCar) {
      throw handleError("Car can't be found.", 404);
    }

    const response = {
      message: "Update the car successfully!",
      info: foundCar,
    };

    handleResponse(res, response);
  } catch (error) {
    next(error);
  }
};

carsController.deleteCar = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const deletedCar = await Car.findOneAndDelete({ _id: ObjectId(carId) });

    if (!deletedCar) {
      throw handleError("Car can't be found.", 404);
    }

    const response = {
      message: "Delete the car successfully!",
      info: deletedCar,
    };

    handleResponse(res, response);
  } catch (error) {
    next(error);
  }
};

module.exports = carsController;
