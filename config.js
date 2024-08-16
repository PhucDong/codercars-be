require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI;

module.exports = { MONGO_URI };
