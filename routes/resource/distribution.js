const express 			= require('express');
const router 			= express.Router();
const dao 				= require('../../common/commonDao');
const call_request_api 	= require('../../common/call_request_api');
const uuid 				= require('uuid4');

const request 			= require('request-promise');

router.get("/", (req, res, next) => {
	res.render("resource/distribution.html", {user_id:n_user_id});
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
		option.qs						=  { datasetId: dataset_id, limit:10000000 };

		console.log("[ SODAS RESOURCE DATASET DISTRIBUTION LIST ]");
		let response 					= await call_request_api.call_api(option);

		if(n_debug_mode) console.log(response);
		res.send(response);
	}catch(e){
		console.log(e);
		res.send({success:false});
	}	
});

// 배포 상세
router.get("/v1/resource/dataset/distribution/get", async (req, res, next) => {
	try{
		let distribution_id				= req.query.distribution_id;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'GET';
		option.url  				    = call_request_api.distribution_get_url;
		option.headers.Authorization 	= access_token;
		option.qs						=  { id: distribution_id };

		console.log(option);
		console.log("[ SODAS RESOURCE DATASET DISTRIBUTION GET ]");
		let response 					= await call_request_api.call_api(option);

		if(n_debug_mode) console.log(response);
		console.log(response);
		res.send(response);
	}catch(e){
		console.log(e);
		res.send({success:false});
	}	
});

// 배포 등록
router.post("/v1/resource/dataset/distribution/save", async (req, res, next) => {
	try{
		console.log( req.body );
		let params						= req.body ;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'POST';
		option.url  				    = call_request_api.distribution_save_url;
		option.headers.Authorization 	= access_token;

		params.sampleType				= "01";
		params.dataType					= "link";
		params.url						= "http://localhost:8080/";

		delete  params.resource_title;
		delete  params.repo_id;
		delete  params.repo_source;
		delete  params.repo_target;
		delete  params.source_file_name;
		
		//option.body						= params;
		option.form						= params;
		console.log(option);

		console.log("[ SODAS RESOURCE DISTRIBUTION SAVE ]");
		let response 					= await call_request_api.call_api(option);
		if(n_debug_mode) console.log(response);
		if(response.id) res.send({success:true});
	}catch(e){
		console.log(e);
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
		
		//option.body						= params;
		option.form						= params;
		console.log(option);

		console.log("[ SODAS RESOURCE DISTRIBUTION UPDATE ]");
		let response 					= await call_request_api.call_api(option);
		if(n_debug_mode) console.log(response);
		if(response.result == 'success') res.send({success:true});
		else res.send({success:false});
	}catch(e){
		console.log(e);
		res.send({success:false});
	}	
});



// 메타데이터 리스트
router.get("/v1/resource/dataset/list", async (req, res, next) => {
	try{
		console.log( req.query );
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

		console.log("[ SODAS RESOURCE GET LIST ]");
		let response 					= await call_request_api.call_api(option);
		if(n_debug_mode) console.log(response);
		
		res.send( response );
	}catch(e){
		console.log(e);
		res.send({success:false});
	}
});

module.exports = router;
