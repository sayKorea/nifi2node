const pg = require('pg');
const prop = require('./dbproperties.js');
const {Pool, Client} = require('pg');

const pool = new Pool ({
	//환경
	// host: "10.39.142.85",
	// port: 5432,
	// user: "sodas_user",
	// password: "sodas_pass",
	// database: "sodasdb",

	// 내부 Virtual Machine
	host: "192.168.1.94", 
	port: 5432,
	user: "pgdba", 
	password: "qweasd123!@#",
	database: "pgdb",

	// host: "10.39.142.85", 
	////////////////////////////////////
	// 문화
	// host: "101.101.169.195", 
	// port: 5432,
	// user: "sodas_user", 
	// password: "sodas_pass",
	// database: "sodas",
	////////////////////////////////////
	// 환경
	// host: "182.173.184.41", 
	// port: 5432,
	// user: "sodas_user", 
	// password: "sodas_pass",
	// database: "sodasdb",
	////////////////////////////////////
	// 로컬
	// host: "127.0.0.1", 
	// port: 5432,
	// user: "sodas_user", 
	// password: "sodas_pass",
	// database: "sodasdb",
	// ssl:false
	////////////////////////////////////
	// 가상
	// host: "127.0.0.1", 
	// port: 5432,
	// user: "sodas_user", 
	// password: "sodas_pass",
	// database: "sodasdb",
	ssl:false
});

module.exports = pool;