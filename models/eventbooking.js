const mongoose = require('mongoose');
const EventBookingSchema = mongoose.Schema({
  id:{
    type: String
  },
	name:{
		type: String
  },
  user:{
    type: String
  },
	numberofguests:{
		type: Number
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
 dates:{
   type:{}
 },
 resources:{
   type:[]
 },
 eventbritelink:{
   type:String
 },
 booked_date:{
   type:Date
 }
});

const EventBooking = module.exports = mongoose.model('EventBooking', EventBookingSchema);
module.exports.getByUser = function(user, callback){
  const query = {user: user};
	EventBooking.find(query,callback);
}
module.exports.getResourcesByBookingID = function(id, callback){
  const query = {id: id};
	EventBooking.findOne(query,callback);
}
module.exports.getBookingByID = function(id, callback){
  const query = {id: id};
	EventBooking.findOne(query,callback);
}
module.exports.addBooking = function(newBooking, callback){
  EventBooking.count((err,len) => {
    if(err)  throw(err);
    len ++;
    newBooking.id += len.toString();
    newBooking.save(callback);
  });
}