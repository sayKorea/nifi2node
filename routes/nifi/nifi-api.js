var express = require('express');
var router = express.Router();

var http = require("http");

//http://192.168.1.10:9999/nifi-api/versions/active-requests

/* GET home page. */
router.get('/view', function(req, res, next) {
  res.render('nifi/nifi-api');
});

router.get('/v1', function(req, res, next) {
  var apiIp = req.param('ip');
  var apiPort = req.param('port');
  var apiUser = req.param('user');
  var apiPass = req.param('pass');
  var apiMethod = req.param('method');
  var apiCommand = req.param('cmd');
  var apiParams = req.param('params');

  console.log(apiCommand);
  console.log(apiMethod);

  var nifiIp = "192.168.1.10";
  var nifiPort = "9999";
  var apiPrefix = "/nifi-api"

  var options = {
      hostname: apiIp,
      port: apiPort,
      method: apiMethod,
      path: apiPrefix+apiCommand
      // headers: {
      //   'Content-Type': 'text/html',
      // }
  };

  var apiRequest = http.request(options, function(apires) {
      console.log('Status: ' + apires.statusCode);
      console.log('Headers: ' + JSON.stringify(apires.headers));
      apires.setEncoding('utf8');
      apires.on('data', function (data) {
        console.log('data: ' + data);
        res.send(data);
      });
  });
  
  apiRequest.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  // apiRequest.write(
  //     '{"text": "test string"}'
  // );
  
  apiRequest.end();
});

module.exports = router;
