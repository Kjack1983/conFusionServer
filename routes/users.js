const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
	User.register(new User({username: req.body.username }), 
		req.body.password, (error, user) => {
		if (error) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({
				error: error
			});
		} 
		else {
			passport.authenticate('local')(req, res, () => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({
					success: true,
					status: 'Registration Successfull!'
				});
			});
		}
	});
})

router.post('/login', passport.authenticate('local'),(req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({
		success: true,
		status: 'You are successfully logged in!'
	});
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