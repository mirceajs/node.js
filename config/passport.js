const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const EventUser = require('../models/event_user');
const ServiceUser = require('../models/service_user');
const config = require('./database');

module.exports = function(passport){
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts , (jwt_payload, done)=>{
		EventUser.getUserById(jwt_payload._id,(err,user)=>{
			if(err){
				return done(err,false);
			}

			if(user){
				return done(null,user);
			} else{
				return done(null,false);
			}
		});
	}));
}