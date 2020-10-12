require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
const jwt = require("./helpers/jwt-helper");
const { ErrorHandler, handleError } = require("./helpers/response-helper");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var app = express();

var indexRouter = require("./routes/index");

// global variables
global._ = require("lodash");
global.moment = require("moment");

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
  next();
});

// verifying token
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let tokenData = await jwt.verifyToken(token);
    if (!tokenData) req.user = undefined;
    req.user = tokenData;
    next();
  } else {
    req.user = undefined;
    next();
  }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// routes handler
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  handleError(err, res);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  next(new ErrorHandler(500, []));
});

module.exports = app;
