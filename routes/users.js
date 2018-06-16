const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const EventUser = require('../models/event_user');
const ServiceUser = require('../models/service_user');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config/database');
var async = require('async');
var crypto = require('crypto');
//Register
router.post('/register_eventuser',(req,res,next)=>{
	let newUser = new EventUser({
		username:req.body.username,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		dateofbirth:req.body.dateofbirth,
		phone:req.body.phone,
		email:req.body.email,
		password:req.body.password,
		address:req.body.address,
		country:req.body.country,
		usertype:req.body.usertype,
	});
	
	
	var bExists = false;
	EventUser.getUserByUsername(newUser.username, (err, user)=>{
		if(err) throw err;
		if(user){
			res.json({success:false,msg:'Username already exists.'});
			bExists = true;
		}
		else{
			EventUser.getUserByEmail(newUser.email, (err, user)=>{
				if(err) throw err;
				if(user){
					res.json({success:false,msg:'Email already exists.'});
				}
				else{
					EventUser.addUser(newUser , (err,user) => {
						if(err){
							res.json({success:false , msg:'Failed to register user'});
						}else{
							res.json({success:true , msg:'Successfully registered'});
						}
					});
				}
			}); 
		}
	});
});
router.get('/getEventUserById:id',(req,res,next)=>{
  
	EventUser.getUserById(req.params.id, (err,user)=>{
		if(err) throw err;
		if(user){
			res.json({success:true,user:user});
		}
		else{
			res.json({success:false});
		}
	})
});
router.get('/getServiceUserById:id',(req,res,next)=>{
	ServiceUser.getUserById(req.params.id, (err,user)=>{
		if(err) throw err;
		if(user){
			res.json({success:true,user:user});
		}
		else{
			res.json({success:false});
		}
	})
});
router.post('/withdrawServiceUser', (req,res,next)=>{
	ServiceUser.withdrawById(req.params, (err,user)=>{
		if(err) throw err;
		if(user){
			res.json({success:true,user:user});
		}
		else{
			res.json({success:false});
		}
	})
});
router.post('/editserviceuser',(req,res,next)=>{
	let newUser = new ServiceUser({
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		dateofbirth:req.body.dateofbirth,
		phone:req.body.phone,
		email:req.body.email,
		address:req.body.address,
		country:req.body.country,
	});

		ServiceUser.getUserByEmail(newUser.email, (err, user)=>{
			if(err) throw err;
			if(user && (user.email != newUser.email)){
				res.json({success:false,msg:'Email already exists.'});
			}
			else{
				ServiceUser.updateUser({id:req.body._id,user:newUser}, (err,user) => {
					if(err){
						res.json({success:false , msg:'Failed to update profile'});
					}else{
						res.json({success:true , msg:'Successfully updated',user:user});
					}
				});
			}
		}); 
	});
router.post('/editeventuser',(req,res,next)=>{
	let newUser = new EventUser({
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		dateofbirth:req.body.dateofbirth,
		phone:req.body.phone,
		email:req.body.email,
		address:req.body.address,
		country:req.body.country,
	});
	var bExists = false;
	EventUser.getUserByUsername(newUser.username, (err, user)=>{

		EventUser.getUserByEmail(newUser.email, (err, user)=>{
			if(err) throw err;
			if(user && (user.email != newUser.email)){
				res.json({success:false,msg:'Email already exists.'});
			}
			else{
				EventUser.updateUser({id:req.body._id,user:newUser}, (err,user) => {
					if(err){
						res.json({success:false , msg:'Failed to update profile'});
					}else{
						res.json({success:true , msg:'Successfully updated',user:user});
					}
				});
			}
		}); 
	});
	
});
router.post('/register_serviceuser',(req,res,next)=>{
	let newUser = new ServiceUser({
		username:req.body.username,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		dateofbirth:req.body.dateofbirth,
		phone:req.body.phone,
		email:req.body.email,
		password:req.body.password,
		address:req.body.address,
		country:req.body.country,
		usertype:req.body.usertype,
	});
	
	
	var bExists = false;
	ServiceUser.getUserByUsername(newUser.username, (err, user)=>{
		if(err) throw err;
		if(user){
			res.json({success:false,msg:'Username already exists.'});
			bExists = true;
		}
		else{
			ServiceUser.getUserByEmail(newUser.email, (err, user)=>{
				if(err) throw err;
				if(user){
					res.json({success:false,msg:'Email already exists.'});
				}
				else{
					ServiceUser.addUser(newUser , (err,user) => {
						if(err){
							res.json({success:false , msg:'Failed to register user'});
						}else{
							res.json({success:true , msg:'Successfully registered'});
						}
					});
				}
			}); 
		}
	});
});
//Authenticate
router.post('/authenticate_eventuser',(req,res,next)=>{
	const username = req.body.username;
	const password = req.body.password;

	EventUser.getUserByUsername(username, (err, user)=>{
		if(err) throw err;
		if(!user){
			return res.json({success:0,msg:'User not found'});
		}

		EventUser.comparePassword(password,user.password,(err,isMatch)=>{
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user.toJSON(),config.secret,{
					expiresIn: 604800
				});
				res.json({
					success:true,
					token: 'JWT '+token,
					user:user,
				});
			}else{
				return res.json({success:false,msg:'Wrong Password'});
			}
		});
	});
});

router.post('/authenticate_serviceuser',(req,res,next)=>{
	const username = req.body.username;
	const password = req.body.password;

	ServiceUser.getUserByUsername(username, (err, user)=>{
		if(err) throw err;
		if(!user){
			return res.json({success:0,msg:'User not found'});
		}

		ServiceUser.comparePassword(password,user.password,(err,isMatch)=>{
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user.toJSON(),config.secret,{
					expiresIn: 604800
				});
				res.json({
					success:true,
					token: 'JWT '+token,
					user:user,
				});
			}else{
				return res.json({success:false,msg:'Wrong Password'});
			}
		});
	});
});
//ForgotPassword
router.post('/forgot_eventuser',(req,res,next)=>{
	async.waterfall([
		function(done) {
		  crypto.randomBytes(20, function(err, buf) {
			var token = buf.toString('hex');
			done(err, token);
		  });
		}, 
		function(token, done) {
		  EventUser.getUserByEmailOrUsername(req.body.data, function(err, user) {
			if (!user) {
				return res.json({success:false,msg:'User not found'});
			}
			
			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
	
			user.save(function(err) {
			  done(err, token, user);
			});
		  });
		},
		function(token, user, done) {
		  var transport = nodemailer.createTransport(smtpTransport(
				{
					host: "smtp.gmail.com", // hostname
					secureConnection: true, // use SSL
					port: 465, // port for secure SMTP
					auth: {
						user: "pavelpanov0224@gmail.com",
						pass: "passwordispassw0rd"
					}
				}));
		  var mailOptions = {
			to: user.email,
			from: 'passwordreset@demo.com',
			subject: 'GetGoing Password Reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  'http://45.77.90.51:3000/event/reset/' + token + '\n\n' +
			  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		  };
		  transport.sendMail(mailOptions, function(err) {
			return res.json({success:true,msg:'An e-mail has been sent to ' + user.email + ' with further instructions.'});
			done(err, 'done');
		  });
		}
	  ], function(err) {
		return res.json({success:false, msg:'An e-mail not sent. Please try again'});
	  });
});
router.post('/reset_eventuser', function(req, res) {
	async.waterfall([
		function(done) {
			EventUser.getUserByToken(req.body.data.token, (err, user) => {
				if (!user) {
					return res.json({success:false, msg:'Password reset token is invalid or has expired.'});
				}
				
				user.password = req.body.data.password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				
				EventUser.addUser(user , (err,user) => {

					if(err){
						return res.json({success:false , msg:'Failed to reset password'});
					}else{
						return res.json({success:true , msg:'Password has been reset'});
					}
				});
			});		
		}
	], function(err) {
		res.redirect('/');
	});
	});

	router.post('/forgot_serviceuser',(req,res,next)=>{
		async.waterfall([
			function(done) {
				crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
				});
			}, 
			function(token, done) {
				ServiceUser.getUserByEmailOrUsername(req.body.data, function(err, user) {
				if (!user) {
					return res.json({success:false,msg:'User not found'});
				}
				
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		
				user.save(function(err) {
					done(err, token, user);
				});
				});
			},
			function(token, user, done) {
				var transport = nodemailer.createTransport(smtpTransport(
					{
						host: "smtp.gmail.com", // hostname
						secureConnection: true, // use SSL
						port: 465, // port for secure SMTP
						auth: {
							user: "pavelpanov0224@gmail.com",
							pass: "passwordispassw0rd"
						}
					}));
				var mailOptions = {
				to: user.email,
				from: 'passwordreset@demo.com',
				subject: 'GetGoing Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://45.77.90.51:3000/service/reset/' + token + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				};
				transport.sendMail(mailOptions, function(err) {
				return res.json({success:true,msg:'An e-mail has been sent to ' + user.email + ' with further instructions.'});
				done(err, 'done');
				});
			}
			], function(err) {
			return res.json({success:false, msg:'An e-mail not sent. Please try again'});
			});
	});
	router.post('/reset_serviceuser', function(req, res) {
		async.waterfall([
			function(done) {
				ServiceUser.getUserByToken(req.body.data.token, (err, user) => {
					if (!user) {
						return res.json({success:false, msg:'Password reset token is invalid or has expired.'});
					}
					
					user.password = req.body.data.password;
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;
					
					ServiceUser.addUser(user , (err,user) => {
	
						if(err){
							return res.json({success:false , msg:'Failed to reset password'});
						}else{
							return res.json({success:true , msg:'Password has been reset'});
						}
					});
				});		
			}
		], function(err) {
			res.redirect('/');
		});
  });
module.exports = router;