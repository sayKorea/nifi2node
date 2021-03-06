'use strict'
const express 			= require("express");
const PropertiesReader 	= require("properties-reader");
const router 			= express.Router();
const call_request_api 	= require("../../common/common_request");
const log 				= require("../../common/logger");

// 배포 화면
router.get("/", (req, res, next) => {
	const properties 		= PropertiesReader("env.properties");
	var center_info 		= {};
	center_info.center_id 	= properties.get("center.id");
	center_info.source_path = properties.get("center.source_path");
	center_info.target_path = properties.get("center.target_path");
	log.debug(JSON.stringify(center_info));

	res.render("distribution/distribution.html", center_info);
});

// 배포 리스트
router.get("/v1/resource/dataset/distribution/list", async (req, res, next) => {
	try{
		let dataset_id					= req.query.dataset_id;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= "GET";
		option.url  				    = call_request_api.distribution_list_url;
		option.headers.Authorization 	= access_token;
		option.qs						= { datasetId: dataset_id, limit:10000000 }; // limit를 안주면 10개만 가지고 오게 되어 있음

		log.debug("[ SODAS RESOURCE DATASET DISTRIBUTION LIST ]");
		let response 					= await call_request_api.call_api(option);
		return res.send(response);
	}catch(e){
		log.error(e);
		return res.send({success:false});
	}	
});

// 배포 상세dddd
router.get("/v1/resource/dataset/distribution/get", async (req, res, next) => {
	try{
		let distribution_id				= req.query.distribution_id;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= "GET";
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

		let price 						= params.price;

		params.sampleType				= "01";
		params.dataType					= "nifi";
		params.url						= "http://localhost:8080/";
		params.fileName					= params.repo_target+"/"+params.source_file_name;
		params.byteSize					= params.byteSize.replace(/,/g,"");

		delete params.resource_title;
		delete params.repo_id;
		delete params.repo_source;
		delete params.repo_target;
		delete params.source_file_name;
		delete params.data_type;
		delete params.data_null;
		delete params.priceType;
		delete params.price;
		
		//option.body						= params;
		option.form						= params;
		log.debug("[ SODAS RESOURCE DISTRIBUTION SAVE ]");

		let response 					= await call_request_api.call_api(option);
		if(response.id) {
			// if(req.body.priceType != "charge"){
			// 	return res.send( {success:true} );
			// }

			price = price.replace(/,/g,"");
			response 					= await call_request_api.price_condtion_save(response.id,price,"distribution", "distribution");
			console.log(response);
			if(response.success){
				return res.send( {success:true} );
			}else{
				return res.send( {success:false} );
			}
		}
		else return res.send({success:false});
	}catch(e){
		log.error(JSON.stringify(e));
		return res.send({success:false});
	}	
});

// 배포 수정
router.post("/v1/resource/dataset/distribution/update", async (req, res, next) => {
	try{
		console.log( req.body );
		let params						= req.body ;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= "POST";
		option.url  				    = call_request_api.distribution_update_url;
		option.headers.Authorization 	= access_token;
		let price						= params.userPrice;
		params.byteSize					= params.byteSize.replace(/,/g,"");

		delete params.data_type;
		delete params.data_null;
		delete params.priceType;
		delete params.userPrice;

		option.form						= params;
		
		log.debug("[ SODAS RESOURCE DISTRIBUTION UPDATE ]");
		let response 					= await call_request_api.call_api(option);
		if(!response.result || response.result != "success") {
			return res.send({success:false})
		}

		// if(req.body.m_priceType != "charge"){
		// 	return res.send( {success:true}  );
		// }
		
		price = price.replace(/,/g,"");

		response 	= await call_request_api.price_condtion_update(req.body.id,price,"distribution", "distribution");
		if(!response.success){
			return res.send( {success:false} );
		}

		return res.send( {success:true} );
	}catch(e){
		log.error(JSON.stringify(e));
		res.send({success:false});
	}	
});

// 배포 삭제
router.post("/v1/resource/dataset/distribution/remove", async (req, res, next) => {
	try{
		console.log( req.body );
		let params						= req.body ;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= "POST";
		option.url  				    = call_request_api.distribution_remove_url;
		option.headers.Authorization 	= access_token;

		option.form						= params;
		log.debug("[ SODAS RESOURCE DISTRIBUTION REMOVE ]");
		let response 					= await call_request_api.call_api(option);

		if(response.result == "success")res.send({success:true});
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
