const fs = require("fs");
const https = require("https");
const http = require("http");
const mongoClient = require("./mongoClient");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception! 💥 shutting down...");
  process.exit(1);
});

const app = require("./app");

const PORT = process.env.PORT || 3100;

(async function () {
  await mongoClient;
  console.log("Connected to DB...");
})();

const SSL_KEY = process.env.SSL_KEY;
const SSL_CERT = process.env.SSL_CERT;

if (SSL_CERT && SSL_KEY) {
  const options = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT),
  };
  const port = 443;
  https.createServer(options, app).listen(port);
  console.log(`Listening on port ${port}`);
}

http.createServer(app).listen(PORT);

console.log(`Listening on port: ${PORT}`);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! 💥 shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
