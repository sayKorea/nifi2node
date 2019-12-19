const express 			= require('express');
const router 			= express.Router();
const dao 				= require('../../common/commonDao');
const call_request_api 	= require('../../common/call_request_api');
const uuid 				= require('uuid4');

const request 			= require('request-promise');

router.get("/", (req, res, next) => {
	res.render("resource/distribution.html", {user_id:n_user_id});
});

// 버젼 부터 가지고 와서 선택
router.get("/v1/resource/dataset/distribution/list", async (req, res, next) => {
	try{
		let dataset_id					= req.query.dataset_id;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();
		option.method 					= 'GET';
		option.url  				    = call_request_api.distribution_list_url;
		option.headers.Authorization 	= access_token;
		option.qs						=  { datasetId: dataset_id };

		console.log("[ SODAS RESOURCE DATASET DISTRIBUTION LIST ]");
		let response 					= await call_request_api.call_api(option);
		if(n_debug_mode) console.log(response);
		
		res.send(response);
	}catch(e){
		console.log(e);
		res.send({success:false});
	}	
});

// 버젼에서 가지고온 ID를 입력하여 해당 카테고리를 가지고 와야됨
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


router.post("/v1/resource/dataset/save", async (req, res, next) => {
	// taxonomy_version: 'b00e9670-19c1-11ea-924e-cf7457dc9c18',
	// category_list: '2',
	// title: '1',
	// ownerId: '2',
	// creatorId: '3',
	// description: '4',
	// descriptionDetail: '5',
	// landingPage: '6',
	// language: 'kr',
	// issued: '7',
	// modified: '8',
	// version: '9',
	// isFree: 'free',
	// isPublic: 'Y',
	// isPersonal: 'Y',
	// extras: '19',
	// spatialResolutionInMeters: '11',
	// temporalResolution: '12',
	// license: '13',
	// method: '14',
	// accrualPeriodicity: '15',
	// temporalStart: '16',
	// temporalEnd: '17',
	// conformsTo: '18'

	try{
		console.log( req.body );
		let params						= req.body;
		let access_token 				= await call_request_api.get_access_token();
		let option 						= call_request_api.get_request_option();

		option.method 					= 'POST';
		option.url  				    = call_request_api.resource_save_url;
		option.headers.Authorization 	= access_token;
		//option.headers['Content-Type']  = 'application/x-www-form-urlencoded';

		var taxonomy 					= {};
		taxonomy.nodeId					= params.category_list;
		taxonomy.nodeType 				= "taxonomy";
		params.taxonomy					= JSON.stringify(taxonomy);
		params.etcValue					= params.extras.trim()!=""?JSON.stringify( params.extras ):{};
		params.userPrice				= 0;
		params.downDate					= "10";
		params.downDateType				= "years";
		params.version					= "1.0";

		delete params.taxonomy_version;
		delete params.category_list;
		delete params.issued;
		delete params.modified;
		delete params.isFree;
		delete params.extras;
		delete params.license;
		delete params.method;
		
		//console.log(params);
		//option.body						= params;
		//Object.prototype.hasOwnProperty.call(params , formData )
		option.form				=  JSON.parse(JSON.stringify(params)) ;

		//console.log(option);
		//console.log(option);
		console.log("[ SODAS RESOURCE SAVE ]");
	
		let response 					= await call_request_api.call_api(option);
		if(n_debug_mode) console.log(response);
		
		res.send( response );
	}catch(e){
		console.log(e);
		res.send({success:false});
	}
});

async function  callDb(query, params){
	var queryResult;
	try {
		// synchronous code     
		if(params)  queryResult = await dao.query(query ,params);
		else  queryResult = await dao.query(query);
		return queryResult;
	} catch(e) {
		//exception handled here   
		console.log(e.message);
		return 0;  
	} 
};

module.exports = router;
