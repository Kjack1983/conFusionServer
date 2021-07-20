let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
var FileStore = require('session-file-store')(session);
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

// handle API that are coming from different origin. Avoid cross origin errors.
//app.use(cors());

//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const auth = (req, res, next) => {
  let { session, headers } = req;
  if (!req.session.user) {    
      let error = new Error('You are not authenticated');
      error.status = 401;
      return next(error);
  } else {
    if (req.session.user === 'authenticated') {
      next();
    }
    else {
      let error = new Error('You are not authenticated');
      error.status = 401;
      return next(error);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

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
