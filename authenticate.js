const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config');
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
	return jwt.sign(
		user,
		config.secretKey, {
			expiresIn: 3600
		}
	);
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
	User.findOne({
		_id: jwt_payload._id
	}, (err, user) => {
		if (err) {
			return done(err, false);
		} else if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	});
}));

exports.verifyAdmin = function (req, res, next) {
	let {
		user: {
			_id
		}
	} = req;

	// find user by id.
	User.findById(_id)
		.then(user => {
			if (user.admin) {
				next();
			} else {
				const error = new Error('You are not authorized to perform this operation!');
				error.status = 403;
				return next(error);
			}
		}, error => next(error))
		.catch(error => next(error))
}

exports.verifyUser = passport.authenticate('jwt', {
	session: false
});


exports.facebookPassport = passport.use(new FacebookTokenStrategy({
	clientID: config.facebook.clientId,
	clientSecret: config.facebook.clientSecret,
	fbGraphVersion: 'v3.0'
}, (accessToken, refreshToken, profile, done) => {
	User.findOrCreate({
		facebookId: profile.id
	}, (error, user) => {
		if (err) {
			console.log(err);
			return done(err, false);
		}
		if (!err && user !== null) {
			return done(null, user);
		} else {
			user = new User({
				username: profile.displayName
			});
			user.facebookId = profile.id;
			user.firstname = profile.name.givenName;
			user.lastname = profile.name.familyName;
			user.save((err, user) => {
				if (err)
					return done(err, false);
				else
					return done(null, user);
			})
		}
	});
}));