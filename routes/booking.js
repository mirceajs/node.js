const express = require('express');
const router = express.Router();
const EventBooking = require('../models/eventbooking');
const ResourceBooking = require('../models/resourcebooking');
const passport = require('passport');
router.post('/addevent', (req,res)=>{
    
    let newBooking = new EventBooking({
    id:req.body.id,
    user:req.body.user,
		name:req.body.event.event_type,
    numberofguests:req.body.event.numberofguests,
    timing:req.body.event.timing,
    dates:JSON.stringify(req.body.event.dates),
    price:req.body.price,
    resources:req.body.resources,
    booked_date:new Date()
    });
    EventBooking.addBooking(newBooking , (err,booking) => {
        if(err){
            res.json({success:false});
        }else{
            res.json({success:true , id:booking.id});
        }
    });
});
router.post('/addEventbriteLink', (req,res)=>{
  let reqObj = req.body;
  EventBooking.getBookingByID(reqObj.id, (err, booking) => {
    if(err){
      return res.json({success:false , msg:'Failed to save eventbrite ticket link'});
    }else{
      booking.eventbritelink = reqObj.link;
      booking.save((err,booking) => {
        if(err) return res.json({success:false , msg:'Failed to save eventbrite ticket link'});
        return res.json({success:true, msg:'Eventbrite ticket link successfully updated.'});
      });
    }
  });
});
router.post('/getAnalysis', (req,res)=>{
    ResourceBooking.getAnalysis(req.body, (err, analysis) => {
    
      if(err || analysis == undefined || analysis[0] == undefined) return res.json({success:false,month:req.body.month});
      else return res.json({success:true, money:analysis[0].money,month:req.body.month,time:analysis[0].time});
    });
});
router.post('/leaveFeedback', (req,res)=>{
    ResourceBooking.leaveFeedback(req.body, (err, feedback) => {
      if(err) return res.json({success:false});
      else return res.json({success:true});
    });
});
router.get('/getResourcesByBookingID/:id', (req,res) => {
  var id = req.params.id;
  EventBooking.getResourcesByBookingID(id, (err, booking) => {
    if(err){
      return res.json({success:false , msg:'Failed to load resources'});
    }else{
      return res.json({success:true , booking:booking});
    }
  });
});
router.get('/getFeedback', (req,res) => {
 
  ResourceBooking.getFeedback(req.query, (err, feedback) => {
    if(err || feedback.length < 1){
      return res.json({success:false});
    }else{
      return res.json({success:true , feedback:feedback});
    }
  });
});

router.get('/getByEventUser/:user', (req,res) => {
  var user = req.params.user;
  EventBooking.getByUser(user, (err, bookings) => {
    if(err){
      return res.json({success:false , msg:'Failed to load booking'});
    }else{
      return res.json({success:true , bookings:bookings});
    }
    
  });
});
router.post('/getResourceBookingByIDs', (req,res) => {

  ResourceBooking.getByIDs(req.body.IDs, (err, bookings) => {
    if(err){
      return res.json({success:false , msg:'Failed to load booking'});
    }else{
      return res.json({success:true , bookings:bookings});
    }
    
  });
});

router.post('/addresource', (req,res)=>{
    let newBooking = new ResourceBooking({
    id:req.body.id,
    name:req.body.resource.name,
		resource_id:req.body.resource._id,
    price:req.body.resource.price * req.body.hour,
    event_type:req.body.event.event_type,
    numberofguests:req.body.event.numberofguests,
    timing:req.body.event.timing,
    dates:JSON.stringify(req.body.event.dates),
    hour:req.body.hour,
    booked_date:new Date()
    });
    ResourceBooking.addBooking(newBooking , (err,user) => {
        if(err){
            res.json({success:false , msg:'Failed to add service'});
        }else{
            res.json({success:true , msg:'Successfully added'});
        }
    });
});
module.exports = router;