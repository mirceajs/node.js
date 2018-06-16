const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const config = require('../config/database');

router.get('/getByServiceId/:id',(req,res,next)=>{

	Order.getByServiceId(req.params.id, (err,orders)=>{
		if(err) throw err;
		if(orders){
			res.json({success:true,orders:orders});
		}
		else{
			res.json({success:false});
		}
	})
});
module.exports = router;