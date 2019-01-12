require("dotenv/config");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "dev";
const http = require("http");
const methodOverride = require("method-override");
const { normalizePort, onError, onListening } = require("./utils");
const morgan = require("morgan");
const errorLogger = require("./middleware/errorLogger");
const moment = require("moment");
const cors = require("cors");
const bodyParser = require("body-parser");


const routes = require("./routes/index");


app.use(morgan("dev")); // log every request to the console
// view engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride());

// LOCALS
app.use(function (req, res, next) {
  // // console.log("RUNNING LOCALS...");
  //res.locals.user = req.session.user;
  res.removeHeader("X-Powered-By");
  next();
});

//Specify which routes to use
app.use("/", routes);



/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "4000");
// var port = normalizePort("5009");
app.set("port", port);
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

//listening
server.listen(port);
server.on("error", err => onError(err, port));
server.on("listening", () => onListening(server));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ status: 404, message: "Route not found!" });
  //next(err);
});

// error handler (see middleware file)
app.use(errorLogger);
