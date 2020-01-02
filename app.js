const createError 	= require("http-errors");
const express 		= require("express");
const session 		= require("express-session");
const path 			= require("path");
const cors 			= require("cors");
const favicon	 	= require("serve-favicon");
const app 			= express();
const log 			= require("./common/logger");

// Global Variable
// Center

// global.g_user_id 	= "sodas_admin";
// global.g_password 	= "so8087";
global.g_user_id 	= "";
global.g_password 	= "";
global.g_center_id	= "default_org";

global.g_debug_mode = "false";
global.g_active_type = process.argv[2];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

app.use(session({
	secret: '!@#$%^&*()secret)(*&^%$#@!',
	resave: false,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
	if(!req.headers.accept) return next();

	var client_ip = req.connection.remoteAddress;
	if(client_ip){
		client_ip = client_ip.split(":");
		client_ip = client_ip[client_ip.length-1];
	}
		
	//console.log(req);
	console.log(req.session); 
	let url = req.url.toLowerCase();
	log.debug("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	log.debug("┃ Host 			: "+req.headers.host);
	log.debug("┃ URL			: "+req.url);
	log.debug("┃ Referer 		: "+req.headers.referer);
	log.debug("┃ User-agent 		: "+req.headers["user-agent"]);
	log.debug("┃ Accept			: "+req.headers.accept);
	log.debug("┃ Accept Encoding		: "+req.headers["accept-encoding"]);
	log.debug("┃ Accept Language		: "+req.headers["accept-language"]);
	log.debug("┃ Method			: "+req.method);
	log.debug("┃ Params			: "+JSON.stringify( req.params) );
	log.debug("┃ Query			: "+JSON.stringify( req.query) );
	log.debug("┃ Body			: "+JSON.stringify( req.body));
	log.debug("┃ Client IP		: "+client_ip );
	if(g_user_id && g_user_id.trim() != "" ){
		log.debug("┃ Login User		: "+g_user_id );	
	}
	log.debug("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	var ha 				= req.headers.accept;
	var exclude_path 	= req._parsedOriginalUrl.pathname;
	
	
	if(ha && (ha.indexOf("application/json") > -1 || ha.indexOf("text/javascript") > -1)){
		console.log("application/json");
		return next();
	} else if(!req.session.userid){
		if(		exclude_path=="/" 
			|| 	exclude_path=="/login" 
			|| 	exclude_path=="/uploads"
			|| 	exclude_path=="/uploads/getFiles"
			// || 	exclude_path=="/admin"
			// || 	exclude_path=="/admin/save"
			|| 	exclude_path=="/admin/hidden"
			|| 	exclude_path=="/admin/hidden/save"
		){
			log.debug("## Exclude Path : "+exclude_path);
			return next();
		}
		return res.redirect('/');
	} else if(req.session.userid){
		log.debug("## Current Session user : "+req.session.userid);
		if(exclude_path == "/") {
			res.url = "/main";
			return res.redirect('/main');
		}else{
			return next();
		}
	}
 });

//ROUTER Mapping
app.use('/', 				require('./routes/index'));
app.use('/admin', 			require('./routes/admin/admin'));
app.use('/repo', 			require('./routes/repository/repository'));
app.use('/nifi', 			require('./routes/nifi/nifi'));
app.use('/resource',		require('./routes/resource/resource'));
app.use('/distribution',	require('./routes/distribution/distribution'));
app.use('/uploads',			require('./routes/uploads/uploads'));
// app.use('/users', 	require('./routes/users/users'));
// app.use('/auth', 	require('./routes/auth/auth'));
// app.use('/org', 	require('./routes/org/org'));
// app.use('/meta', 	require('./routes/meta/meta'));
// app.use('/load', 	require('./routes/load/load'));
app.all('*',(req,res) => res.status(404).send('<h1> 요청 페이지 없음 </h1>'));

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
// 	console.log("app.use(function (req, res, next) {");
// 	next(createError(404));
// });

//error handler
app.use(function (err, req, res, next) {
	console.log("app.use(function (err, req, res, next) {");
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'dev' ? err : {};
	console.log(err);
	// render the error page
	res.status(err.status || 500);
	res.render('error/error');
});


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

module.exports = app;
