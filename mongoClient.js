const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let clientPromise;
const DB_URL = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
if (!global._mongoClientPromise) {
  global._mongoClientPromise = mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  clientPromise = global._mongoClientPromise;
}

module.exports = clientPromise;
