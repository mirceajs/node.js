const mongoose = require('mongoose');
const ResourceBookingSchema = mongoose.Schema({
	id:{
		type: String
  },
  name:{
    type: String
  },
  resource_id:{
    type: String
  },
	event_type:{
		type: String
	},
	location:{
		type:{}
	},
	timing:{
		type:[]
	},
	numberofguests:{
		type: Number
	},
	price:{
		type: Number
	},
 hour:{
		type: Number
	},   
 dates:{
   type:{}
 },
 feedback:{
   type:{}
 },
 booked_date:{
   type:Date
 }
});

const ResourceBooking = module.exports = mongoose.model('ResourceBooking', ResourceBookingSchema);

module.exports.addBooking = function(newBooking, callback){
	newBooking.save(callback);
}
module.exports.getFeedback = function(obj, callback){
  var query = {};
  
  if(obj.bookID != 'undefined'){
    query = {resource_id:obj.resourceID, 'id':{'$regex':new RegExp('^' + obj.bookID)}};
  }else{
    query = {resource_id:obj.resourceID, feedback:{$exists:true}};
    
  }    
  ResourceBooking.find(query,{feedback:1,_id:0},callback);
}
module.exports.leaveFeedback = function(obj, callback){
  const query = {resource_id:obj.resourceID, id:{$regex: new RegExp('^' + obj.bookID)}};
 
  ResourceBooking.findOne(query,(err,resource) => {
    if(resource != null){
    resource.feedback = obj.feedback;
    resource.save(callback);
    }
  });

}
module.exports.getAnalysis = function(obj, callback){

//  ResourceBooking.aggregate([{$match:{"_id":obj.id}},   {$project: { month: {$month: '$date'},"price":1,"hour":1}},   {$match: {month: 3}},{$group:{"_id":null,"money":  {"$sum":"$price"},"time":{"$sum":"$hour"}}}], callback);  
  ResourceBooking.aggregate([{$match:{"resource_id":obj.id}},   {$project: { month: {$month: '$booked_date'},year: {$year: '$booked_date'},"price":1,"hour":1}},   {$match: {year:obj.year,month: obj.month}},{$group:{"_id":null,"money":  {"$sum":"$price"},"time":{"$sum":"$hour"}}}],callback);
}

module.exports.getByIDs = function(IDs, callback){

  const query = {resource_id: {$in: IDs}};
	ResourceBooking.find(query,callback);
}