const mongoose = require('mongoose');
const config = require('../Config/database');

const AnalysisSchema = mongoose.Schema({
	name:{
		type: String
	},
	resource_id:{
		type:String
	},
	date:{
    type: Date
  }
});

const Analysis = module.exports = mongoose.model('Analysis', AnalysisSchema);


module.exports.addAnalysis = function(newAnalysis, callback){
	newAnalysis.save(callback);
}
module.exports.getChosenAnalysis = function(obj, callback){
//  ResourceBooking.aggregate([{$match:{"_id":obj.id}},   {$project: { month: {$month: '$date'},"price":1,"hour":1}},   {$match: {month: 3}},{$group:{"_id":null,"money":  {"$sum":"$price"},"time":{"$sum":"$hour"}}}], callback);  
  Analysis.aggregate([{$match:{"resource_id":obj.id, "name":"chosen"}},   {$project: { month: {$month: '$date'},year: {$year: '$date'}}},   {$match: {year:obj.year,month: obj.month}},{$group:{"_id":null,count: { $sum: 1 }}}], callback);
}
module.exports.getSkippedAnalysis = function(obj, callback){
//  ResourceBooking.aggregate([{$match:{"_id":obj.id}},   {$project: { month: {$month: '$date'},"price":1,"hour":1}},   {$match: {month: 3}},{$group:{"_id":null,"money":  {"$sum":"$price"},"time":{"$sum":"$hour"}}}], callback);  
  Analysis.aggregate([{$match:{"resource_id":obj.id, "name":"skipped"}},   {$project: { month: {$month: '$date'},year: {$year: '$date'}}},   {$match: {year:obj.year,month: obj.month}},{$group:{"_id":null,count: { $sum: 1 }}}], callback);
}
module.exports.getFacebookAnalysis = function(obj, callback){

  Analysis.aggregate([{$match:{"resource_id":obj.id, "name":"facebook"}},   {$project: { month: {$month: '$date'},year: {$year: '$date'}}},   {$match: {year:obj.year,month: obj.month}},{$group:{"_id":null,count: { $sum: 1 }}}], callback);
}
module.exports.getTwitterAnalysis = function(obj, callback){
  Analysis.aggregate([{$match:{"resource_id":obj.id, "name":"twitter"}},   {$project: { month: {$month: '$date'},year: {$year: '$date'}}},   {$match: {year:obj.year,month: obj.month}},{$group:{"_id":null,count: { $sum: 1 }}}], callback);
}