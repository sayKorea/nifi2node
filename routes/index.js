var express = require('express');
var router = express.Router();
var dao = require('../common/commonDao');

/* GET Login page. */
router.get('/', function(req, res, next) {
  res.render('login/login.html');
});

/* GET Login. */
router.get('/login', function(req, res, next) {
	var userid = req.query.userid;
	var password = req.query.password;

	console.log(userid+" / "+password);

	var query = 'SELECT COUNT(1) AS CNT FROM USER WHERE USER_ID=\''+userid+'\' AND USER_PASS=\''+password+'\'';

	dao.getConnection(function(conn) {
		conn.query(query)
			.then((data) => {
				conn.end();
				res.send(data);
			})
			.catch(err => {
				//handle error
				console.log(err);
				conn.end();
			});
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
