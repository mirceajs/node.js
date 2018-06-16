const mongoose = require('mongoose');
const config = require('../Config/database');

//User 
const ServiceSchema = mongoose.Schema({
	name:{
		type: String
    },
    user:{
        type: String
    },
	description:{
		type: String
	},
	location:{
		type:{}
	},
	timing:{
		type:{}
	},
	numberofguests:{
		type: Number
	},
	price:{
		type: Number
	},
	images:{
        type:[]
	},
	days:{
		type:[]
	}
});

const Service = module.exports = mongoose.model('Service', ServiceSchema);


module.exports.getServicesByEvent = function(event, callback){
	const query = {price: { $lt:event.budget}, name:event.service, numberofguests:{$gt:event.numberofguests}};
	Service.find(query,callback);
}
module.exports.getServiceById = function(id, callback){
	const query = {_id: id};
	Service.findOne(query,callback);
}

module.exports.getServiceByUser = function(user, callback){
	const query = {user: user};
	Service.find(query,callback);
}
module.exports.addService = function(newService, callback){
	newService.save(callback);
}
module.exports.removeService = function(id, callback){
    const query = {_id:id};
    Service.remove(query, callback);
}
module.exports.getIDsByUser = function(user, callback){
  const query = {user: user};
	Service.find(query,{_id:1},callback);
} 

module.exports.getGenerated = function(obj, callback){
  const query = {_id:obj.id};
  Service.findOne(query,{generated:1},callback);
}
module.exports.getByIds = function(IDs, callback){
  const query = {_id:{$in: IDs}};
  Service.find(query,callback);
}

module.exports.updateService = function(updateObj, callback){
	Service.update({_id:updateObj.id},{$set:{name:updateObj.service.name,description:updateObj.service.description,
		user:updateObj.service.user,location:updateObj.service.location,timing:updateObj.service.timing,numberofguests:updateObj.service.numberofguests,
		price:updateObj.service.price,images:updateObj.service.images}},callback)
}