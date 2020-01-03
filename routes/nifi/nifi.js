'use strict'
const express 			= require("express");
const request 			= require("request-promise");
const uuid 				= require("uuid4");
const ip 				= require("ip");
const router 			= express.Router();
const PropertiesReader 	= require("properties-reader");
const dao 				= require("../../common/common_dao");
const log 				= require("../../common/logger");

const nifiPort 	= "20000";
const webPort	= "18080";
const debug_log = true;

let webHost;
let nifiHost;
let client_id;
let source_path;
let target_path;
let resource_id;
let source_file_name;

var process_group				= "";
var process_group_stop			= "";
var process_group_start			= "";
var list_sftp_url 				= "";
var list_fetch_url 				= "";
var http_invoke_start 			= "";
var http_invoke_end				= "";
var client_id_flow				= "";
var get_put_sftp				= "";
var valid_json_str				= "";
var controller_service_1		= "";
var controller_service_2		= "";
var put_file					= "";
var put_hdfs					= "";
var get_file					= "";


router.get('/', (req, res, next) => {
	console.log(res);
	console.log("NIFI CALL API");
	res.send({success:true});
});

router.get('/test', async (req, res, next) => {
	callRequest();
	res.send({success:true});
});

router.get('/process_set', async (req, res, next) => {
	try {
		const properties 		= PropertiesReader("env.properties");
		console.log(req.query);
		host 				= ip.address();
		webHost 			= host+":"+webPort;
		nifiHost 			= host+":"+nifiPort;
		client_id 			= "";
		source_path 		= req.query.source_path;
		target_path 		= req.query.target_path;
		resource_id 		= req.query.resource_id;
		source_file_name 	= req.query.source_file_name;

		log.debug("NIFI HOST : "+nifiHost);
		log.debug("WEB HOST : "+webHost);
		log.debug("SOURCE PATH : "+source_path);
		log.debug("TARGET PATH : "+target_path);
		log.debug("FILE NAME : "+source_file_name);

		//console.log("dpath : "+this.dpath);
		var queryResult;
		// var resource_id = req.query.resource_id;
		
		// var query  = " SELECT 	  A.DATA_LOAD_NO 	  	";
		// 	query += " 			, B.REPO_NO 		  	";
		// 	query += " 			, B.REPO_NM 		  	";
		// 	query += " 			, C.META_NO 		  	";
		// 	query += " 			, C.META_SOURCE_HOST 		  	";
		// 	query += " 			, C.META_SOURCE_PORT 		  	";
		// 	query += " 			, C.META_SOURCE_USER 		  	";
		// 	query += " 			, C.META_SOURCE_PASS 		  	";
		// 	query += " 			, C.META_SOURCE_PATH 		  	";
		// 	query += " 			, C.META_SOURCE_NIFI_API_URL 		  	";
		// 	query += " 			, C.META_TARGET_HOST 		  	";
		// 	query += " 			, C.META_TARGET_PORT 		  	";
		// 	query += " 			, C.META_TARGET_USER 		  	";
		// 	query += " 			, C.META_TARGET_PASS 		  	";
		// 	query += " 			, C.META_TARGET_PATH 		  	";
		// 	query += " 			, C.META_TARGET_NIFI_API_URL 		  	";
		// 	query += " 			, C.META_VALID_STR 		  	";
		// 	query += " 			, A.JOB_NM 		  		";
		// 	query += " 			, A.JOB_DESC 		  	";
		// 	query += " 			, A.JOB_EXE_RESULT  	";
		// 	query += " 			, A.JOB_EXE_TYPE 	  	";
		// 	query += " 			, A.JOB_EXE_UNIT 	  	";
		// 	query += " 			, A.JOB_EXE_UNIT_VAL	";
		// 	query += " 			, A.JOB_EXE_TIME 	  	";
		// 	query += " 			, A.JOB_START_TIME  	";
		// 	query += " 			, A.JOB_END_TIME 	  	";
		// 	query += " 			, A.REG_ID		  		";
		// 	query += " 			, A.REG_DT		  		";
		// 	query += " 			, A.MOD_ID		  		";
		// 	query += " 			, A.MOD_DT	      		";
		// 	query += " FROM DATA_LOAD A, REPOSITORY B, META_DATA C";
		// 	query += " WHERE A.REPO_NO=B.REPO_NO                  ";
		// 	query += " AND   A.META_NO=C.META_NO                  ";
		// 	if(resource_id && resource_id != "") query +=" AND A.DATA_LOAD_NO="+resource_id;
		// 	query +=" ORDER BY DATA_LOAD_NO";

		// //console.log(query);
		// queryResult = await callDb(query);

		process_group				= "http://"+nifiHost+"/nifi-api/flow/process-groups/025e7acc-016f-1000-7010-f9b2184249dc"
		process_group_stop			= {"id":"025e7acc-016f-1000-7010-f9b2184249dc","state":"STOPPED"};// 종료
		process_group_start			= {"id":"025e7acc-016f-1000-7010-f9b2184249dc","state":"RUNNING"}; // 시작
		list_sftp_url 				= "http://"+nifiHost+"/nifi-api/processors/dcb98120-f26e-3b85-71ce-8fbbebb694d5";
		list_fetch_url 				= "http://"+nifiHost+"/nifi-api/processors/95d5e7c1-5dc2-3e38-1805-44d7c8ce6562";
		http_invoke_start 			= "http://"+nifiHost+"/nifi-api/processors/0872c0aa-016f-1000-7b64-39896c9a633f";
		http_invoke_end				= "http://"+nifiHost+"/nifi-api/processors/0872f212-016f-1000-28f4-f0950aaf4f69";
		client_id_flow				= "http://"+nifiHost+"/nifi-api/flow/client-id";
		get_put_sftp				= "http://"+nifiHost+"/nifi-api/processors/041a81d1-329b-314c-5d88-8c520970cbf0";
		
		//disabled AvroSchemaRegistry 관련 process Disabled
		// var controller_service_CSVReader= "http://"+nifiHost+"/nifi-api/controller-services/50b66ea9-3212-3801-1d22-a0b76a255c70"; // CSVReader
		// var controller_service_CSVReader= "http://"+nifiHost+"/nifi-api/controller-services/06834f35-7664-34ef-5f7e-2cbbbf3fb965"; // CSVRecordSetWriter
		// var controller_service_CSVReader= "http://"+nifiHost+"/nifi-api/controller-services/53ba3f4e-b56d-3bde-9d0c-0f2f162de329"; // AvroSchemaRegistry
		
		valid_json_str				= "http://"+nifiHost+"/nifi-api/controller-services/53ba3f4e-b56d-3bde-9d0c-0f2f162de329"; // AvroSchemaRegistry
		controller_service_1		= "http://"+nifiHost+"/nifi-api/controller-services/50b66ea9-3212-3801-1d22-a0b76a255c70"; // CSVReader
		controller_service_2		= "http://"+nifiHost+"/nifi-api/controller-services/06834f35-7664-34ef-5f7e-2cbbbf3fb965"; // CSVRecordSetWriter
		//e658b541-3202-3ef9-c5cf-383f477bf0bf, eb881d34-03aa-3f6f-c026-5bf1c9fe05fe

		put_file					= "http://"+nifiHost+"/nifi-api/processors/f43c51d9-016e-1000-dd34-26cf860577ad";
		put_hdfs					= "http://"+nifiHost+"/nifi-api/processors/9cba7261-31ad-3e0f-80d5-4ff1deaf210a";
		get_file					= "http://"+nifiHost+"/nifi-api/processors/aa9a257c-ab1a-3554-9864-17319c098747";


		var insert  = " INSERT INTO DATA_LOAD_DETAIL(DATASET_UUID, PROCESS_NAME, PROCESS_TYPE, PROCESS_SUCCESS, PROCESS_START_TIME)";
			insert += " VALUES ($1, $2, $3, $4, CURRENT_DATE)";
		var params = [resource_id, 'nifi setting start', '', 'success'];
		queryResult = await callDb(insert ,params);//dao.query(insert ,params);


		//Option Templete
		var requestOption = { 
			method		: "",
			url			: "",
			json		: true ,
			headers: {
				Connection: 'keep-alive',
				Host: nifiHost,
				Accept: '*/*','Content-Type': 'application/json' 
			},
			body:{}
		};

		let responese;		

		//////////////////////////////////////////
		// ALL PROCESS STOP 
		//////////////////////////////////////////
		//put
		requestOption.method = 'PUT';
		requestOption.url  = process_group;
		requestOption.body = process_group_stop;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 01. Process Group Properties Modfy Success!]");
			//log.debug(responese);
		}


		//////////////////////////////////////////
		// GET CLIENT ID
		//////////////////////////////////////////
		requestOption.method = 'GET';
		requestOption.url = client_id_flow;
		requestOption.body = null;
		client_id = await callAPI(requestOption);
		if(responese){
			log.debug("[ 02. Get Flow - Client ID]");
			//log.debug(responese);
		}

		//////////////////////////////////////////
		// FILE LIST
		//////////////////////////////////////////
		//get
		// requestOption.method = 'GET';
		// requestOption.url = list_sftp_url;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 03. List SFTP Properties Get Success!]]");
		// 	console.log(responese);
		// }

		//put
		// requestOption.method = 'PUT';
		// responese.component.config.properties.Hostname = "10.39.143.190 ";
		// responese.component.config.properties.Port = "22";
		// responese.component.config.properties.Username = "ncloud";
		// responese.component.config.properties.Password = "ifKebp20!9i";
		// responese.component.config.properties['Remote Path'] = "/home1/ncloud/get";
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 04. List SFTP Properties Modfy Success!]]");
		// 	console.log(responese);
		// }

		//////////////////////////////////////////
		// LIST FETCH
		//////////////////////////////////////////
		//get
		// requestOption.method = 'GET';
		// requestOption.url = list_fetch_url;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 05. List FETCH Properties Get Success!]]");
		// 	console.log(responese);
		// }
		
		//put
		// requestOption.method = 'PUT';
		// responese.component.config.properties.Hostname = "10.39.143.190 ";
		// responese.component.config.properties.Port = "22";
		// responese.component.config.properties.Username = "ncloud";
		// responese.component.config.properties.Password = "ifKebp20!9i";
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 06. List FETCH Properties Modfy Success!]]");
		// 	console.log(responese);
		// }

		//////////////////////////////////////////
		// GET FILE
		//////////////////////////////////////////
		//get
		requestOption.method = 'GET';
		requestOption.url = get_file;
		requestOption.body = null;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 05. Get File Start Properties Get Success!]");
		}
		
		//put
		requestOption.method = 'PUT';
		responese.component.config.properties['Input Directory'] = source_path;//"/home1/ncloud/apps/test-data/";
		responese.component.config.properties['File Filter'] = source_file_name;

		requestOption.body =responese;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 06. Get File Start Properties Modfy Success!]");
			//log.debug(responese);
		}

		//////////////////////////////////////////
		// HTTP INVOKE START
		//////////////////////////////////////////
		//get
		requestOption.method = 'GET';
		requestOption.url = http_invoke_start;
		requestOption.body = null;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 07. HTTP INVOKE Start Properties Get Success!]");
			//log.debug(responese);
		}
		
		//put
		requestOption.method = 'PUT';
		responese.component.config.properties['HTTP Method'] = "GET";
		responese.component.config.properties['Remote URL'] = "http://"+webHost+"/nifi/process_log?dataset_uuid="+resource_id+"&stepNm=process start&success=success";
		requestOption.body =responese;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 08. HTTP INVOKE Start Properties Modfy Success!]");
			//log.debug(responese);
		}

		//////////////////////////////////////////
		// HTTP INVOKE END
		//////////////////////////////////////////
		requestOption.method = 'GET';
		requestOption.url = http_invoke_end;
		requestOption.body = null;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 09. HTTP INVOKE Start Properties Get Success!]");
			//log.debug(responese);
		}
		
		//put
		requestOption.method = 'PUT';
		responese.component.config.properties['HTTP Method'] = "GET";
		responese.component.config.properties['Remote URL'] = "http://"+webHost+"/nifi/process_log?dataset_uuid="+resource_id+"&stepNm=process end&success=success";
		requestOption.body =responese;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 10. HTTP INVOKE Start Properties Modfy Success!]");
			//log.debug(responese);
		}

		

		//////////////////////////////////////////
		// GET PUT SFTP
		//////////////////////////////////////////
		requestOption.method = 'GET';
		requestOption.url = get_put_sftp;
		requestOption.body = null;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 11. PUT HDFS Properties Get Success!]");
			//log.debug(responese);
		}
		
		//put
		requestOption.method = 'PUT';
		responese.component.config.properties["Remote Path"] =target_path;			//"/hadoop/dfs/test"; // /hsdoop/dfs/test
		//신대수 수정
		//responese.component.config.properties["Hostname"] ="182.173.185.41";		//"/hadoop/dfs/test"; // /hsdoop/dfs/test
		responese.component.config.properties["Port"] ="22";						//"/hadoop/dfs/test"; // /hsdoop/dfs/test
		responese.component.config.properties["Username"] ="ncloud";				//"/hadoop/dfs/test"; // /hsdoop/dfs/test
		responese.component.config.properties["Password"] ="ifKebp20!9i";			//"/hadoop/dfs/test"; // /hsdoop/dfs/test
	
		requestOption.body = responese;
		responese = await callAPI(requestOption);
		if(responese){
			log.debug("[ 12.GET SFTP Properties Modfy Success!]");
			//log.debug( responese.component.config.properties["Remote Path"] );
			//log.debug(responese);
		}


		//////////////////////////////////////////
		// PUT FILE
		//////////////////////////////////////////
		// requestOption.method = 'GET';
		// requestOption.url = put_file;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 11. PUT File Start Properties Get Success!]]");
		// 	console.log(responese);
		// }
		
		//put
		// requestOption.method = 'PUT';
		// responese.component.config.properties["Directory"] = "/hadoop/dfs";
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 12. PUT File Start Properties Modfy Success!]]");
		// 	console.log(responese);
		// }


		//////////////////////////////////////////
		// PUT HDFS
		//////////////////////////////////////////
		// requestOption.method = 'GET';
		// requestOption.url = put_hdfs;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 11. PUT HDFS Properties Get Success!]]");
		// 	if(debug_log) console.log(responese);
		// }
		
		//put
		// requestOption.method = 'PUT';
		// responese.component.config.properties["Directory"] =target_path;//"/hadoop/dfs/test"; // /hsdoop/dfs/test
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){
		// 	console.log("[ 12. PUT HDFS Properties Modfy Success!]]");
		// 	console.log( responese.component.config.properties["Directory"] );
		// 	if(debug_log) console.log(responese);
		// }

		//////////////////////////////////////////
		// Controller Service - CSVReader Disabled
		//////////////////////////////////////////
		// requestOption.method = 'GET';
		// requestOption.url = controller_service_CSVReader;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ 10. Controller Service - CSVReader Properties Get Success!]]");}
		// console.log(responese);

		// //put
		// requestOption.method = 'PUT';
		// responese.component.status.runStatus = "DISABLED";
		// responese.component.state = 'DISABLED';
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ 11. Controller Service - CSVReader Properties Modfy Service DISABLED Success!]]");}

		// //////////////////////////////////////////
		// // Controller Service - CSVRecordSetWriter Disabled
		// //////////////////////////////////////////
		// requestOption.method = 'GET';
		// requestOption.url = controller_service_2;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ Controller Service - JsonRecordSetWriter Properties Get Success!]]");}
		
		// //put
		// requestOption.method = 'PUT';
		// responese.component.state = "DISABLED";
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ Controller Service - CSVReader Properties Modfy Success!]]");}

		// //////////////////////////////////////////
		// // VALID JSON STR - AvroSchemaRegistry
		// //////////////////////////////////////////
		// requestOption.method = 'GET';
		// requestOption.url = valid_json_str;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ VALID JSON STR Properties Get Success!]]");}

		// //put
		// requestOption.method = 'PUT';
		// responese.component.state = "DISABLED";
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ VALID JSON STR Properties Modfy Success!]]");}
		
		// //put
		// requestOption.method = 'PUT';
		// responese.component.state = "ENABLED";
		// responese.component.properties.candy = queryResult.meta_valid_str;
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ VALID JSON STR Properties Modfy Success!]]");}


		// //////////////////////////////////////////
		// // Controller Service - CSVReader
		// //////////////////////////////////////////
		// requestOption.method = 'GET';
		// requestOption.url = controller_service_1;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ Controller Service - CSVReader Properties Get Success!]]");}

		// //put
		// requestOption.method = 'PUT';
		// responese.component.state = "ENABLED";
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ Controller Service - CSVReader Properties Modfy Success!]]");}

		// //////////////////////////////////////////
		// // Controller Service - CSVRecordSetWriter
		// //////////////////////////////////////////
		// requestOption.method = 'GET';
		// requestOption.url = controller_service_2;
		// requestOption.body = null;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ Controller Service - JsonRecordSetWriter Properties Get Success!]]");}
		
		// //put
		// requestOption.method = 'PUT';
		// responese.component.state = "ENABLED";
		// requestOption.body =responese;
		// responese = await callAPI(requestOption);
		// if(responese){console.log("[ Controller Service - JsonRecordSetWriter Properties Modfy Success!]]");}

		//NIFI START
		var insert  = " INSERT INTO DATA_LOAD_DETAIL(DATASET_UUID, PROCESS_NAME, PROCESS_TYPE, PROCESS_SUCCESS, PROCESS_START_TIME)";
			insert += " VALUES ($1, $2, $3, $4, CURRENT_DATE)";
		var params = [resource_id, 'nifi setting end', '', 'success'];
		queryResult = await callDb(insert ,params);//dao.query(insert ,params);

		//////////////////////////////////////////
		// ALL PROCESS START 
		//////////////////////////////////////////
		//put
		requestOption.method = 'PUT';
		requestOption.url	=  process_group;
		requestOption.body =process_group_start;
		responese = await callAPI(requestOption);
		//if(responese){console.log("[ Process Group Properties Modfy Success!]]");}

		if(responese){
			log.debug("[ 13. Process Group Properties Modfy Success!]");
			//log.debug(responese);

			//NIFI START
			var insert  = " INSERT INTO DATA_LOAD_DETAIL(DATASET_UUID, PROCESS_NAME, PROCESS_TYPE, PROCESS_SUCCESS, PROCESS_START_TIME)";
			insert += " VALUES ($1, $2, $3, $4, CURRENT_DATE)";
			var params = [resource_id, 'nifi start', '', 'success'];
			queryResult = await callDb(insert ,params);//dao.query(insert ,params);
			//log.debug(queryResult);
		}
		return res.send({success:true});;
	} catch (error) {
		//NIFI FAIL
		var insert  = " INSERT INTO DATA_LOAD_DETAIL(DATASET_UUID, PROCESS_NAME, PROCESS_TYPE, PROCESS_SUCCESS, PROCESS_START_TIME)";
			insert += " VALUES ($1, $2, $3, $4, CURRENT_DATE)";
		var params = [resource_id, 'nifi setting', '', 'fail'];
		queryResult = await callDb(insert ,params);//dao.query(insert ,params);

		log.debug(error);
	 	return res.status(500).send({success:false});;
	}
	
});

router.get('/process_log', async (req, res, next) => {
	log.debug("############################# PROCESS LOG");
	
	var dataset_uuid = req.query.dataset_uuid;
	var stepNm = req.query.stepNm;
	var success = req.query.success;
	var insert  = " INSERT INTO DATA_LOAD_DETAIL(DATASET_UUID, PROCESS_NAME, PROCESS_TYPE, PROCESS_SUCCESS, PROCESS_START_TIME)";
		insert += " VALUES ($1, $2, $3, $4, CURRENT_DATE)";
		
	var params = [dataset_uuid, stepNm, '', success];
	// dao.query(insert ,params , result);

	var queryResult = await callDb(insert ,params);//dao.query(insert ,params);
	//log.debug(queryResult);

	if(stepNm == "process end"){
		var h = ip.address();
		var w = h+":"+nifiPort;

		var process_group		= "http://"+w+"/nifi-api/flow/process-groups/025e7acc-016f-1000-7010-f9b2184249dc"
		var process_group_stop	= {"id":"025e7acc-016f-1000-7010-f9b2184249dc","state":"STOPPED"};// 종료

		//Option Templete
		var requestOption = { 
			method		: "",
			url			: "",
			json		: true ,
			headers: {
				Connection: 'keep-alive',
				Host: nifiHost,
				Accept: '*/*','Content-Type': 'application/json' 
			},
			body:{}
		};
	
		try{
			let responese;
			//console.log(h);
			//console.log(w);
			//console.log(process_group);
			//console.log(process_group_stop);
			//////////////////////////////////////////
			// ALL PROCESS START 
			//////////////////////////////////////////
			//put
			requestOption.method = 'PUT';
			requestOption.url	=  process_group;
			requestOption.body =process_group_stop;
			responese = await callAPI(requestOption);

			if(responese){
				log.debug("[ Process Group Properties Stop Success!]");
				log.debug( JSON.stringify(responese));
			}
			res.send({success:true});return true;
		} catch (error) {
			log.debug(JSON.stringify(error));
			res.status(500).send({success:false});return false;
		}
	}else{
		res.send({success:true});return true;
	}
});

var callDb = async (query, params) => {
	var queryResult;
	try {
		// synchronous code     
		if(params) {
			queryResult = await dao.query(query ,params);
			log.debug(params)
			log.debug(JSON.stringify(queryResult))
		}else  {
			queryResult = await dao.query(query);
			log.debug(JSON.stringify(queryResult));
		}
		return queryResult;
	} catch(e) {
		//exception handled here   
		log.error(JSON.stringify(e));
		return false;  
	} 
};

 var callAPI = async (option) => {
	return new Promise((resolve, reject) => {
		request(option, function (e, r, b) {
			if (e){
				log.error(JSON.stringify(e));
				reject({ success:false  });
			}else{
				log.deubg(JSON.stringify(b));
				resolve(b);
			} 
		});
	});
};

module.exports = router;