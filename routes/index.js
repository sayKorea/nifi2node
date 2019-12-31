const express 			= require('express');
const dao 				= require('../common/common_dao');
const router 			= express.Router();
const ip 				= require('ip');
const fs 				= require('fs');
const log 				= require("../common/logger");
const session 			= require('express-session');
const call_request_api 	= require('../common/common_request');

/* GET Login page. */
router.get('/etc', async (req, res, next) => {
	try{
		var database_test = await callDb("SELECT CURRENT_DATE");
		log.debug("## Database Initialize Test");
		if(database_test.rowCount != 1){
			res.render('error/error.html');
		}

		log.debug ("## SERVER IP : " + ip.address() );
		// log.debug ("## CLIENT IP : " + getUserIP(req) );
	// res.render('login/login.html');
	}catch(e) {
		//exception handled here  
		console.log(e.message);
		res.render('error/error.html');
	}
	
	res.render('main/main.html');
});

/* GET Login page. */
router.get('/', async (req, res, next) => {
	try{
		var database_test = await callDb("SELECT CURRENT_DATE");
		log.debug("## Database Initialize Test");
		if(!database_test || database_test.rowCount != 1){
			console.log("## Database ERROR!");
			return res.render('error/error.html');
		}else{
			log.debug ("## SERVER IP : " + ip.address() );
			return  res.render('login/login.html');
		}
	}catch(e) {
		//exception handled here  
		console.log(e.message);
		return res.render('error/error.html');
	} 
});

/* GET Login. */
router.get('/login', async (req, res, next) => {
	console.log(req.query);
	g_user_id = req.query.userid;
	g_password = req.query.password;

	try{
		let sodas = await call_request_api.get_access_token();
		console.log(sodas);
		if(sodas && sodas.length > 50){
			log.info("login id : "+g_user_id);
			log.info("center id : "+g_center_id);
			req.session.userid = g_user_id;
			res.send({success:true});
		}else{
			res.send({success:false});
		}
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}
});

/* GET Login. */
// router.get('/login', (req, res, next) => {
// 	var userid = req.query.userid;
// 	var password = req.query.password;
// 	var params = [userid, password];
// 	log.debug(userid+" / "+password);
// 	var session = req.session;
// 	var query = 'SELECT COUNT(1) AS CNT FROM USERS WHERE USER_ID=$1 AND USER_PASS=$2';
// 	dao.query(query,params, (e, r) => {
// 		console.log(r.rows);
// 		if(r.rows[0].cnt === "1"){
// 			req.session.userid = userid;
// 		}
// 		res.send(r.rows);
// 	});
// });

/* GET Login page. */
router.get('/main', (req, res, next) => {
  	res.render('main/main.html');
});

/* GET Login page. */
router.get('/logout', (req, res, next) => {
	req.session.userid = "";
	res.render('login/login.html');
});

var callDb = async (query, params) => {
	var queryResult;
	try {
		// synchronous code
		if(params) queryResult = await dao.query(query ,params);
		else queryResult = await dao.query(query);
		return queryResult;
	} catch(e) {
		//exception handled here  
		log.debug(e.message);
		return false;  
	} 
};

function getUserIP(req){
    var ipAddress;

	if(!!req.hasOwnProperty('sessionID')){
        ipAddress = req.headers['x-forwarded-for'];
    } else{
        // if(!ipAddress){
            var forwardedIpsStr = req.header('x-forwarded-for');

            if(forwardedIpsStr){
                var forwardedIps = forwardedIpsStr.split(',');
                ipAddress = forwardedIps[0];
            }
            if(!ipAddress){
                ipAddress = req.connection.remoteAddress;
            }
        // }
    }
    return ipAddress;
};

module.exports = router;
