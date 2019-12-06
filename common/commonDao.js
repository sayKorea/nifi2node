const pg = require('pg');
const prop = require('./dbproperties.js');
const {Pool, Client} = require('pg');

const pool = new Pool ({
	host: "192.168.1.94", 
	port: 5432,
	user: "pgdba", 
	password: "qweasd123!@#",
	database: "pgdb",
	ssl:false
});

module.exports = pool;