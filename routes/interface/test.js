var express = require('express');
var router = express.Router();
var http = require("http");

router.get('/view', function(req, res, next) {
	res.render('test/testView');
});

module.exports = router;
