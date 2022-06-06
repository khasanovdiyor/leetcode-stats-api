const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception! 💥 shutting down...");
  process.exit(1);
});

const app = require("./app");

const DB_URL = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection established ");
  });

const port = process.env.PORT || 3100;
const server = app.listen(port, () => {
  console.log(`App is running at ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! 💥 shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
