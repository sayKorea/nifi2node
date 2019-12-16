const express = require('express');
const dao = require('../common/commonDao');
const router = express.Router();
const ip = require('ip');
/* GET Login page. */
router.get('/', async function(req, res, next) {
	try{
		var database_test = await callDb("SELECT CURRENT_DATE");
		console.log("SELECT CURRENT_DATE");
		if(database_test.rowCount != 1){
			res.render('error/error.html');
		}

		console.log ("SERVER IP : " + ip.address() );
		console.log ("CLIENT IP : " + getUserIP(req) );
	// res.render('login/login.html');
	}catch(e) {
		//exception handled here  
		console.log(e.message);
		res.render('error/error.html');
	} 
	
	res.render('main/main.html');
});

/* GET Login. */
router.get('/login', function(req, res, next) {
	var userid = req.query.userid;
	var password = req.query.password;
	var params = [userid, password];
	console.log(userid+" / "+password);

	var query = 'SELECT COUNT(1) AS CNT FROM USERS WHERE USER_ID=$1 AND USER_PASS=$2';
	dao.query(query,params, (e, r) => {
		//console.log(e, r)
		//pool.end()
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
		console.log(e.message);
		return 0;  
	} 
};

function getUserIP(req){
    var ipAddress;

    if(!!req.hasOwnProperty('sessionID')){
        ipAddress = req.headers['x-forwarded-for'];
    } else{
        if(!ipAddress){
            var forwardedIpsStr = req.header('x-forwarded-for');

            if(forwardedIpsStr){
                var forwardedIps = forwardedIpsStr.split(',');
                ipAddress = forwardedIps[0];
            }
            if(!ipAddress){
                ipAddress = req.connection.remoteAddress;
            }
        }
    }
    return ipAddress;
};

module.exports = router;
