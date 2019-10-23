var express = require('express');
var router = express.Router();
var http = require("http");


  //http://192.168.1.10:9999/nifi-api/versions/active-requests

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/nifi', function(req, res, next) {
  var nifiIp = "192.168.1.10";
  var nifiPort = "9999";
  var apiPrefix = "/nifi-api"
  var options = {
      hostname: nifiIp,
      port:nifiPort,
      method: 'get',
      path: apiPrefix+"/flow/about"
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
