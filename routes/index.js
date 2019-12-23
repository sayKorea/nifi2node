const express 	= require('express');
const dao 		= require('../common/common_dao');
const router 	= express.Router();
const ip 		= require('ip');
const fs 		= require('fs');
const log 		= require("../common/logger");
const session 	= require('express-session');
/* GET Login page. */
router.get('/2', async function(req, res, next) {
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
router.get('/', async function(req, res, next) {
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
	
	res.render('login/login.html');
});

/* GET Login. */
router.get('/login', function(req, res, next) {
	var userid = req.query.userid;
	var password = req.query.password;
	var params = [userid, password];
	log.debug(userid+" / "+password);
	var session = req.session;
	var query = 'SELECT COUNT(1) AS CNT FROM USERS WHERE USER_ID=$1 AND USER_PASS=$2';
	dao.query(query,params, (e, r) => {
		console.log(r.rows);
		if(r.rows[0].cnt === "1"){
			req.session.userid = userid;
		}
		res.send(r.rows);
	});
});

/* GET Login page. */
router.get('/main', function(req, res, next) {
  	res.render('main/main.html');
});

/* GET Login page. */
router.get('/logout', function(req, res, next) {
	res.render('login/login.html');
});

async function  callDb(query, params){
	var queryResult;
	try {
		// synchronous code     
		if(params) queryResult = queryResult = await dao.query(query ,params);
		else queryResult = await dao.query(query);
		return queryResult;
	} catch(e) {
		//exception handled here  
		log.debug(e.message);
		return 0;  
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
