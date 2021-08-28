const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

// passport library.
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');

const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const leadersRouter = require('./routes/leadersRouter');
const promotionsRouter = require('./routes/promotionsRouter');
const uploadRouter = require('./routes/uploadRouter');

// Models
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');

// Create connection.
const dbConnection = require('./connection/db-connection');
require('dotenv').config() // this will allow us to use the env variable.

// Create express
let app = express();

/* app.all('*', (req, res, next) => {
	if(req.secure) {
		return next();
	} else {
		res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
	}
}) */

//db connection
dbConnection.connectToDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

// fetch data from the request body.
app.use(bodyParser.json());
app.use(express.urlencoded({
	extended: false
}));

// handle API that are coming from different origin. Avoid cross origin errors.
//app.use(cors());

//app.use(cookieParser('12345-67890-09876-54321'));
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', dishRouter);
app.use('/api', leadersRouter);
app.use('/api', promotionsRouter);
app.use('/api', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;