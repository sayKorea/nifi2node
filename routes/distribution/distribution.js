const express 			= require('express');
const router 			= express.Router();
const call_request_api 	= require('../../common/common_request');
const log 				= require("../../common/logger");

// 배포 화면
router.get("/", (req, res, next) => {
	res.render("distribution/distribution.html", {user_id:g_user_id});
});

// 배포 리스트
router.get("/v1/resource/dataset/distribution/list", async (req, res, next) => {
	try{
		let dataset_id					= req.query.dataset_id;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'GET';
		option.url  				    = call_request_api.distribution_list_url;
		option.headers.Authorization 	= access_token;
		option.qs						= { datasetId: dataset_id, limit:10000000 }; // limit를 안주면 10개만 가지고 오게 되어 있음

		log.debug("[ SODAS RESOURCE DATASET DISTRIBUTION LIST ]");
		let response 					= await call_request_api.call_api(option);
		res.send(response);
	}catch(e){
		log.error(e);
		res.send({success:false});
	}	
});

// 배포 상세dddd
router.get("/v1/resource/dataset/distribution/get", async (req, res, next) => {
	try{
		let distribution_id				= req.query.distribution_id;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'GET';
		option.url  				    = call_request_api.distribution_get_url;
		option.headers.Authorization 	= access_token;
		option.qs						=  { id: distribution_id };

		log.debug("[ SODAS RESOURCE DATASET DISTRIBUTION GET ]");
		let response 					= await call_request_api.call_api(option);
		res.send(response);
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}	
});

// 배포 등록
router.post("/v1/resource/dataset/distribution/save", async (req, res, next) => {
	try{
		let params						= req.body ;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'POST';
		option.url  				    = call_request_api.distribution_save_url;
		option.headers.Authorization 	= access_token;

		params.sampleType				= "01";
		params.dataType					= "nifi";
		params.url						= "http://localhost:8080/";
		params.fileName					= params.repo_target+"/"+params.source_file_name;

		delete  params.resource_title;
		delete  params.repo_id;
		delete  params.repo_source;
		delete  params.repo_target;
		delete  params.source_file_name;
		delete  params.data_type;
		delete  params.data_null;

		//option.body						= params;
		option.form						= params;
		log.debug("[ SODAS RESOURCE DISTRIBUTION SAVE ]");

		let response 					= await call_request_api.call_api(option);
		if(response.id){
			res.send({success:true});
		}else{
			res.send({success:false});
		}
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}	
});

// 배포 수정
router.post("/v1/resource/dataset/distribution/update", async (req, res, next) => {
	try{
		console.log( req.body );
		let params						= req.body ;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'POST';
		option.url  				    = call_request_api.distribution_update_url;
		option.headers.Authorization 	= access_token;

		delete params.data_type;
		delete params.data_null;

		option.form						= params;
		log.debug("[ SODAS RESOURCE DISTRIBUTION UPDATE ]");
		let response 					= await call_request_api.call_api(option);

		if(response.result == 'success') {
			res.send({success:true});
		}
		else res.send({success:false});
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}	
});



// 메타데이터 리스트
router.get("/v1/resource/dataset/list", async (req, res, next) => {
	try{
		let params						= {};
		let keyword 					= req.query.s_keyword;
		let offset 						= req.query.offset; 
		let limit 						= req.query.limit; 
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'GET';
		option.url  				    = call_request_api.resource_list_url;
		option.headers.Authorization 	= access_token;
		params.offset					= offset;
		params.limit					= limit;
		if(keyword)	params.keyword 		=  keyword;
		
		option.qs			= params;

		log.debug("[ SODAS RESOURCE GET LIST ]");
		let response 					= await call_request_api.call_api(option);
		
		res.send( response );
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}
});

module.exports = router;
