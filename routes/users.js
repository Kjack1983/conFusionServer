const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
	User.findOne({
			username: req.body.username
		})
		.then((user) => {
			if (user !== null) {
				let error = new Error('User' + req.body.username + ' already exists');
				error.status = 403;
				next(error);
			} else {
				return User.create({
					username: req.body.username,
					password: req.body.password
				})
			}
		})
		.then((user) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({
				status: 'Registration Successfull!',
				user: user
			});
		}, (error) => next(error))
		.catch(error => next(error));
})

router.post('/login', (req, res, next) => {
	if (!req.session.user) {
		var authHeader = req.headers.authorization;

		if (!authHeader) {
			var err = new Error('You are not authenticated!');
			res.setHeader('WWW-Authenticate', 'Basic');
			err.status = 401;
			return next(err);
		}

		var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
		var username = auth[0];
		var password = auth[1];

		User.findOne({
				username: username
			})
			.then((user) => {
				if (user === null) {
					var err = new Error('User ' + username + ' does not exist!');
					err.status = 403;
					return next(err);
				} else if (user.password !== password) {
					var err = new Error('Your password is incorrect!');
					err.status = 403;
					return next(err);
				} else if (user.username === username && user.password === password) {
					req.session.user = 'authenticated';
					res.statusCode = 200;
					res.setHeader('Content-Type', 'text/plain');
					res.end('You are authenticated!')
				}
			})
			.catch((err) => next(err));
	} else {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.end('You are already authenticated!');
	}
});

router.get('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/')
	} else {
		let error = new Error('You are not logged in');
		error.status = 403;
		next(error);
	}
})

module.exports = router;