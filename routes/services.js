const express = require('express');
const router = express.Router();
const multer = require('multer');
const Service = require('../models/service');
const Analysis = require('../models/analysis');
const passport = require('passport');
const async = require('async');
var store = multer.diskStorage({ 
    destination: function(req, file, cb){
        cb(null, './public/uploads');
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + '.' + file.originalname);
    }
});
var upload = multer({storage:store}).single('file');

router.post('/upload',(req,res)=>{
    upload(req, res, function(err){
        if(err){
            return res.json({success:false, msg:err});
        }
        res.json({success:true, uploadname:req.file.filename});
    })
});
router.post('/getAnalysis', (req,res)=>{
    Analysis.getChosenAnalysis(req.body, (err, analysis) => {
      var chosen = 0, skipped = 0, facebook = 0, twitter = 0;       
      if(err || analysis == undefined || analysis[0] == undefined){
         chosen = 0;
      }else{
        chosen = analysis[0].count;
      }
        Analysis.getSkippedAnalysis(req.body, (err, analysis2) => {
          
          if(err || analysis2 == undefined || analysis2[0] == undefined){
             skipped = 0;
          }else{
              
              skipped = analysis2[0].count;
              
          }
          Analysis.getFacebookAnalysis(req.body, (err, analysis3) => {
          
          if(err || analysis3 == undefined || analysis3[0] == undefined){
             facebook = 0;
          }else{
              
              facebook = analysis3[0].count;
              
          }
          Analysis.getTwitterAnalysis(req.body, (err, analysis4) => {
          
          if(err || analysis4 == undefined || analysis4[0] == undefined){
             twitter = 0;
          }else{
              
              twitter = analysis4[0].count;
              
          }
           return res.json({success:true, chosen:chosen,month:req.body.month,skipped:skipped, twitter:twitter, facebook:facebook});
        });
        });
        
      });
    });
});
router.post('/addanalysis', (req,res) => {

  let newAnalysis = new Analysis({
		    name:req.body.name,
        resource_id:req.body.id,
        date: new Date()
    });
  Analysis.addAnalysis(newAnalysis, (err, analysis) =>{});
});
router.get('/getServiceIDsByUser/:user',(req,res,next)=>{
	Service.getIDsByUser(req.params.user, (err,IDs)=>{
		if(err) throw err;
		if(IDs){
			res.json({success:true,IDs:IDs});
		}
		else{
			res.json({success:false,msg:"Failed to load booking."});
		}
	})
});
router.post('/removeService', (req,res)=>{
    Service.removeService(req.body.id, (err)=>{
        if(err){

            return res.json({success:false});  
        }
        res.json({success:true});
    });
});
router.post('/increasegenerated', (req,res)=>{
    Service.increasegenerated(req.body.id, (err)=>{
        if(err){
            return res.json({success:false});  
        }
        res.json({success:true});
    });
});
router.get('/getByIds', (req,res) => {
  var IDs = req.query.IDs.split(',');
  Service.getByIds(IDs, (err, resources) => {
    if(err || resources.length < 1){
      return res.json({success:false});
    }else{
      return res.json({success:true , resources:resources});
    }
  });
});

router.post('/add',(req,res)=>{
    
    let newService = new Service({
		name:req.body.name,
        user:req.body.user,
        description:req.body.description,
        location:req.body.location,
        timing:req.body.timing,
        numberofguests:req.body.numberofguests,
        price:req.body.price,
        images:req.body.images,
    });
    Service.addService(newService , (err,user) => {
        if(err){
            res.json({success:false , msg:'Failed to add service'});
        }else{
            res.json({success:true , msg:'Successfully added'});
        }
    });
});
router.post('/edit',(req,res)=>{
    
    let newService = new Service({
		name:req.body.name,
        user:req.body.user,
        description:req.body.description,
        location:req.body.location,
        timing:req.body.timing,
        numberofguests:req.body.numberofguests,
        price:req.body.price,
        images:req.body.images
    });

    Service.updateService({id:req.body._id, service:newService} , (err,user) => {
        if(err){
            res.json({success:false , msg:'Failed to update service'});
        }else{
            res.json({success:true , msg:'Successfully updated'});
        }
    });
});
router.post('/getByEvent',(req,res,next)=>{
    Service.getServicesByEvent(req.body, (err, services)=>{
        if(err){
            res.json({resources:{}});
        }else{
            res.json({resources:services});
        }
    });
});
router.get('/getByUser/:user',(req,res,next)=>{
   
    var user = req.params.user;
    Service.getServiceByUser(user, (err, services)=>{
        if(err){
            res.json({success:false , msg:'Failed to load services'});
        }else{
            res.json({success:true,resources:services});
        }
    });
});
router.get('/getById/:id',(req,res,next)=>{
     var id = req.params.id;
     Service.getServiceById(id, (err, service)=>{
         if(err){
             res.json({success:false , msg:'Failed to load services'});
         }else{
             res.json({success:true,resource:service});
         }
     });
 });

module.exports = router;
 