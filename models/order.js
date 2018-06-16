const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../Config/database');





const OrderSchema = mongoose.Schema({
	name:{
		type: String
    },
    date:{
        type: String
    },
	country:{
		type:String
	},
	paid:{
		type:Number
	},
	serviceid:{
		type: String
	},
	feedback:{
		type: String
	}
});
const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.getByServiceId = function(id, callback){
    const query = {};
	Order.find(query,callback);
}
