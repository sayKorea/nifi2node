const createError 	= require('http-errors');
const express 		= require('express');
const path 			= require('path');
const cookieParser 	= require('cookie-parser');
const cors 			= require('cors');
const logger 		= require('morgan');
const favicon	 	= require('serve-favicon');
const app 			= express();

global.n_debug_mode = "false";
global.n_user_id 	= "sodas_admin";
global.n_password 	= "so8087";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));



//ROUTER Mapping
app.use('/', 		require('./routes/index'));
// app.use('/users', 	require('./routes/interface/users'));
// app.use('/auth', 	require('./routes/interface/auth'));
// app.use('/org', 	require('./routes/interface/org'));
app.use('/repo', 	require('./routes/interface/repository'));
// app.use('/meta', 	require('./routes/interface/meta'));
// app.use('/load', 	require('./routes/interface/load'));
// app.use('/test', 	require('./routes/interface/test'));
app.use('/nifi', 	require('./routes/interface/nifi'));
app.use('/resource',require('./routes/resource/resource'));
app.use('/distribution',require('./routes/resource/distribution'));
app.all('*',(req,res) => res.status(404).send('<h1> 요청 페이지 없음 </h1>'));


// catch 404 and forward to error handler
app.use(function (req, res) {
	//console.log("app.use(function (req, res) {");
	console.log(req);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	// console.log(req);
	// console.log(next);
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
