const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
let authenticate = require('../authenticate');

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, (req, res, next) => {
	const {user: {_id, admin} } = req; 
	User.findById(_id).then((user, err) => {
		if (user.admin) {
			User.find({}).then(users => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(users);
			}, err => next(err))
			.catch(err => next(err))
		} else {
			res.statusCode = 403;
			res.setHeader('Content-Type', 'application/json');
			res.json({error: 'You are not authorized for this operation'});
		}
	}, err => next(err))
	.catch(err => next(err))
});

router.post('/signup', (req, res, next) => {
	User.register(new User({ username: req.body.username }), 
		req.body.password, (error, user) => {
		if (error) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({
				error: error
			});
		} 
		else {
			if (req.body.firstname) 
				user.firstname = req.body.firstname;
			if (req.body.lastname)
				user.lastname = req.body.lastname;
			user.save((error, user) => {
				if(error) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({error: error});
					return;
				}
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({
						success: true,
						status: 'Registration Successfull!'
					});
				});
			});
		}
	});
})

router.post('/login', passport.authenticate('local'),(req, res) => {
	let token = authenticate.getToken({_id: req.user._id});
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({
		success: true,
		token: token,
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