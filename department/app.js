const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const DepartmentRouter = require('./routes/routes.config');

const path = require('path');

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, envFile )});
const PORT = process.env.PORT || 3003;
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin',"*" );
    res.header('Access-Control-Allow-Methods', 'GET,GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Origin,Accept, Authorization, Content-Type, X-Requested-With, Range,X-Auth');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
      }
      else {
        next();
      }
    });



app.use(bodyParser.json());

// Setting up the logging
// setupLogging(app);

// Route definition
DepartmentRouter.routesConfig(app);

app.get("/healthcheck", (_req, res) => {
    res.status(200).send("Departement service is runnning");
  });

module.exports = app;
