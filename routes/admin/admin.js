'use strict'
const express 			= require("express");
const PropertiesReader 	= require("properties-reader");
const router 			= express.Router();
const log 				= require("../../common/logger");

router.get("/", (req, res, next) => {
	const properties 		= PropertiesReader("env.properties");

	var center_info = {};
	center_info.center_id = properties.get("center.id");
	center_info.source_path = properties.get("center.source_path");
	center_info.target_path = properties.get("center.target_path");
	log.debug(JSON.stringify(center_info));
	res.render("admin/admin.html", center_info);
});

router.post("/save", async (req, res, next) => {
	const properties 		= PropertiesReader("env.properties");
	try{
		console.log( req.body );
		properties.set("center.id", req.body.center_id);
		properties.set("center.source_path", req.body.source_path);
		properties.set("center.target_path", req.body.target_path);
		g_center_id = req.body.center_id;
		properties.save("env.properties",function then(err,data){
			if(err) {
				console.log(err);
				res.send({success:false});
			} else {
				console.log(data);
				res.send({success:true});
			}
		});
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}
});

router.get("/hidden", (req, res, next) => {
	const properties = PropertiesReader("env.properties");

	var hidden_info = {};
	//Application
	hidden_info.app_version 	= properties.get("app.version");
	hidden_info.app_name 		= properties.get("app.name");
	hidden_info.app_log_level 	= properties.get("app.log_level");

	//Center
	hidden_info.center_id 		= properties.get("center.id");
	hidden_info.source_path 	= properties.get("center.source_path");
	hidden_info.target_path 	= properties.get("center.target_path");

	//Database
	hidden_info.db_host 		= properties.get("db.host");
	hidden_info.db_port 		= properties.get("db.port");
	hidden_info.db_user 		= properties.get("db.user");
	hidden_info.db_pass	 		= properties.get("db.pass");
	hidden_info.db_name 		= properties.get("db.name");

	//Sodas
	hidden_info.sodas_host 		= properties.get("sodas.host");
	hidden_info.sodas_port 		= properties.get("sodas.port");

	log.debug(JSON.stringify(hidden_info));
	res.render("admin/hidden.html", hidden_info);
});

router.post("/hidden/save", async (req, res, next) => {
	try{
		console.log( req.body );
		const properties = PropertiesReader("env.properties");
		properties.set("app.log_level", req.body.log_level);
		properties.set("center.id", req.body.center_id);
		properties.set("center.source_path", req.body.source_path);
		properties.set("center.target_path", req.body.target_path);
		properties.set("db.host", req.body.db_host);
		properties.set("db.port", req.body.db_port);
		properties.set("db.user", req.body.db_user);
		properties.set("db.pass", req.body.db_pass);
		properties.set("db.name", req.body.db_name);
		properties.set("sodas.host", req.body.sodas_host);
		properties.set("sodas.port", req.body.sodas_port);

		properties.save("env.properties",function then(err,data){
			if(err) {
				console.log(err);
				res.send({success:false});
			}
			else {
				console.log(data);
				res.send({success:true});
			}
		});
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}
});
module.exports = router;
