let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const cors = require('cors');
let mongoose = require('mongoose');
const bodyParser = require('body-parser');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let dishRouter = require('./routes/dishRouter');
let leadersRouter = require('./routes/leadersRouter');
let promotionsRouter = require('./routes/promotionsRouter');

// Models
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');

// Create connection.
const dbConnection = require('./connection/db-connection');
require('dotenv').config() // this will allow us to use the env variable.

// Create express
let app = express();

//db connection
dbConnection.connectToDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

// fetch data from the request body.
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// handle API that are coming from different origin. Avoid cross origin errors.
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', dishRouter);
app.use('/api', leadersRouter);
app.use('/api', promotionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
