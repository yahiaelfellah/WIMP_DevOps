const webpack = require("webpack");
const express = require("express");
const { setupLogging } = require("./utils/logging");
const { setupProxies } = require("./utils/proxy");
const { setupAuthentication } = require("./security/index.security");
const { routes } = require("./routes/routes");
const { setupRateLimit } = require("./utils/rateLimit");
const { setupBodyParser } = require("./utils/bodyparser");
const config = require("dotenv").config();
/**
 * Declaration of Express object
 */
const app = express();
///enabling CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range,X-Auth"
  );
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Setting up the logging
setupLogging(app);
// Setting up the Authentication for the gateway
setupAuthentication(app, routes);
// Setting up the rate Limit for the gateway
setupRateLimit(app, routes);
// Setting up the Proxy
setupProxies(app, routes);
// Setting up the bodyParser for the specific endpoint
setupBodyParser(app, routes);

app.get("/", (_req, res) => {
  res.status(200).send("is runnning");
});
module.exports = app;
