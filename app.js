const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const favicon = require('serve-favicon');

const app = express();
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
app.use('/users', 	require('./routes/interface/users'));
app.use('/auth', 	require('./routes/interface/auth'));
app.use('/org', 	require('./routes/interface/org'));
app.use('/repository', require('./routes/interface/repository'));
app.use('/meta', 	require('./routes/interface/meta'));
app.use('/load', 	require('./routes/interface/load'));
app.use('/test', 	require('./routes/interface/test'));

// catch 404 and forward to error handler
app.use(function (req, res) {
	//console.log("app.use(function (req, res) {");
	//console.log(req);
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
