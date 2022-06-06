const mongoClient = require("./mongoClient");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception! 💥 shutting down...");
  process.exit(1);
});

const app = require("./app");

const port = process.env.PORT || 3100;
const server = app.listen(port, async () => {
  await mongoClient;
  console.log("Connect to DB");
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
