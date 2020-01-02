const express 			= require('express');
const router 			= express.Router();
const ip 				= require('ip');
const os 				= require('os');
const fs 				= require('fs');
const session 			= require('express-session');
const dao 				= require('../common/common_dao');
const log 				= require("../common/logger");
const call_request_api 	= require('../common/common_request');

/* GET Login page. */
router.get('/', async (req, res, next) => {
	try{
		var database_test = await callDb("SELECT CURRENT_DATE");
		log.debug("## Database Initialize Test");
		if(!database_test || database_test.rowCount != 1){
			log.error("## Database ERROR!");
			var error_title = "DB Connect error!";
			var error_message = "Check database Please!";
			return res.render("error/error.html",{error_title:error_title,error_message:error_message});
		}else{
			log.debug ("## SERVER IP : " + ip.address() );
			return  res.render("login/login.html");
		}
	}catch(e) {
		//exception handled here  
		log.debug(JSON.stringify(e));
		return res.render("error/error.html");
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
  	res.render('main/main.html',{user_id:g_user_id});
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
		log.debug(JSON.stringify(e));
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
