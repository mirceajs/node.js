const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./Config/database');
const users = require('./routes/users');
const services = require('./routes/services');
const booking = require('./routes/booking');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'ASalIiQpI-N-cBDc7_1_MVa6pyczDYpAmKoJfQik1DHd-s8AyFIDS-QnrBWjU5o7jlbePUTCgGrf7Lz7',
	'client_secret': 'EGW1mDLh-30n_wR9ZI-UswLPT5ynNooqZrZ53yEavXr225l6flX9kiKpl6qVVgLn2SZy_hS1sCiMZqSs'
  });
// Connect to database
mongoose.connect(config.database);

//On Connection
mongoose.connection.on('connected',()=>{
	console.log('Connected to database '+config.database);
});

//On Error
mongoose.connection.on('error',(err)=>{
	console.log('Database Error: '+err);
});

const app = express();



//Port Number
const port = 3000;
const whitelist = [
    'http://45.77.90.51:3000',
    'http://localhost:4200',
    'null',
];
const corsOptions = {
    origin: function(origin, callback){
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));
//Set Static Folder


// serve angular front end files from root path

app.use('/', express.static(path.join(__dirname, 'public'), { redirect: false }));

// rewrite virtual urls to angular app to enable refreshing of internal pages


//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middlware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.post('/pay', function(req, res) {
	const create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://45.77.90.51:3000/pay/success",
			"cancel_url": "http://45.77.90.51:3000/event/organise"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "item",
					"sku": "item",
					"price": req.body.price,
					"currency": "EUR",
					"quantity": 1
				}]
			},
			"amount": {
				"currency": "EUR",
				"total": req.body.price
			},
			"description": "This is the payment description."
		}]
	};
	paypal.payment.create(create_payment_json, function (error, payment) {
		if (error) {
			throw error;
		} else {
			for(let i = 0 ; i < payment.links.length; i ++){
				if(payment.links[i].rel === 'approval_url'){
			      return res.json({success:true, 'approval_url':payment.links[i].href});
				}
			}
		}
	});	
});
app.post('/execute_pay', (req, res) => {
  const payerId = req.body.PayerID;
  const paymentId = req.body.paymentId;
    
  var execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "EUR",
            "total": req.body.price
        }
    }]
  };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        res.send({success:false});
        throw error;
        
    } else {

        res.send({success:true});
    }
});
});
app.post('/withdraw', (req, res) => {
  const amount = req.body.amount;
  const id = req.body.email;
  var data = {
    "amount": {
        "currency": "EUR",
        "total": amount
    }
    };

    paypal.sale.refund(id, data, function (error, refund) {
    if (error) {
        return res.json({success:false,msg:"Withdraw failed"});
        //throw error;
    } else {
        console.log({success:true,msg:JSON.stringify(refund)});
    }

}); 
});
app.use('/users',users);
app.use('/services',services);
app.use('/booking', booking);
//Index Route

app.get('*', function (req, res, next) {
	res.sendFile(path.resolve(path.join(__dirname, 'public/index.html')));
 });

app.use(function (req, res) {
	res.writeHeader(200, {'Content-Type': 'text/html'});
	res.end("angular routing");
});
//Start Server
app.listen(port , () => {
	console.log('Server started on port '+port);
});