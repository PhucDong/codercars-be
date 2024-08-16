// const fs = require("fs");
const csv = require("csvtojson");
const Car = require("./models/Car");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

const createCarData = async () => {
  await mongoose.connect(MONGO_URI);

  let newData = await csv().fromFile("data.csv");
  newData = newData.map((car, index) => {
    return {
      make: car.Make,
      model: car.Model,
      release_date: car.Year,
      transmission_type: car["Transmission Type"],
      price: car.MSRP,
      size: car["Vehicle Size"],
      style: car["Vehicle Style"],
      isDeleted: false,
    };
  });

  // const currentData = JSON.parse(fs.readFileSync("db.json"));
  // currentData.cars = newData;
  // fs.writeFileSync("db.json", JSON.stringify(currentData));
  await Car.insertMany(newData);

  mongoose.connection.close();
};

createCarData();
