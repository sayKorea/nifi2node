const express = require('express');
const dao = require('../common/commonDao');
const router = express.Router();

/* GET Login page. */
router.get('/', function(req, res, next) {
  res.render('login/login.html');
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
  
module.exports = router;
