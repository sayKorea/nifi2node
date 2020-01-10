const request 			= require("request-promise");
const PropertiesReader 	= require("properties-reader");
const log 				= require("../common/logger");
//  내부 클라우드
let sodas_ip 			= "";
let sodas_port 			= "";

// const sodas_ip 		= "182.173.185.98";
// const sodas_port 		= "3000";
// Login User sodas_admin / so8087

const sodas_prefix 		= "/api/v1";
const sodas_protocol 	= "http";
let sodas_url			= "";

let api_structure 							= {};
api_structure.sodas_url 					= sodas_url;
api_structure.tenant_post_user_url 			= "/tenant/user/login";
api_structure.taxonomy_get_version_list_url = "/reference-model/taxonomy/version/list";
api_structure.category_get_list_url 		= "/reference-model/taxonomy/category/list";

//RESOURCE
api_structure.resource_list_url 			= "/resource/dataset/list";
api_structure.resource_get_url 				= "/resource/dataset/get";
api_structure.resource_save_url 			= "/resource/dataset/save";
api_structure.resource_update_url 			= "/resource/dataset/update";
api_structure.resource_remove_url 			= "/resource/dataset/remove";
 
//DISTRIBUTION
api_structure.distribution_list_url 		= "/resource/dataset/distribution/list";
api_structure.distribution_get_url 			= "/resource/dataset/distribution/get";
api_structure.distribution_save_url 		= "/resource/dataset/distribution/save";
api_structure.distribution_update_url 		= "/resource/dataset/distribution/update";
api_structure.distribution_remove_url 		= "/resource/dataset/distribution/remove";

//PRICE INFO
api_structure.price_condtion_list_url 		= "/resource/dataset/priceCondition/list";
api_structure.price_condtion_get_url 		= "/resource/dataset/priceCondition/get";
api_structure.price_condtion_save_url 		= "/resource/dataset/priceCondition/save";
api_structure.price_condtion_update_url 	= "/resource/dataset/priceCondition/update";
api_structure.price_condtion_remove_url 	= "/resource/dataset/priceCondition/remove";

// request 옵션
api_structure.get_request_option = () => {
	const properties 	= PropertiesReader("env.properties");
	sodas_ip 			= properties.get("sodas.host");
	sodas_port 			= properties.get("sodas.port");
	sodas_url			= sodas_protocol+"://"+sodas_ip+":"+sodas_port+sodas_prefix;
	return { 
		method		: "",
		url			: "",
		json		: true,
		headers: {
			Connection: "keep-alive",
			Host: sodas_ip,
			Accept: "*/*",
			//"Content-Type": "application/json",
			Authorization: ""
		},
		body:{}
	};
};

api_structure.call_api = async(option) =>{
	const properties 	= PropertiesReader("env.properties");
	sodas_ip 			= properties.get("sodas.host");
	sodas_port 			= properties.get("sodas.port");
	sodas_url			= sodas_protocol+"://"+sodas_ip+":"+sodas_port+sodas_prefix;
	return new Promise((resolve, reject) => {
		option.url = sodas_url+option.url;
		log.info(JSON.stringify(option));
		request(option, function (e, r, b) {
			if (e){
				// console.log(e);
				// console.log(r);
				// console.log(b);
				log.error(JSON.stringify(e));
				log.error(JSON.stringify(b));
				log.error(JSON.stringify(r));
			}
			log.debug("API StatusCode "+r.statusCode);
			if (!e && ( r.statusCode == 200 ||r.statusCode == 201 )) {
				log.info(JSON.stringify(b));
				resolve(b);
			} else {
				log.info(JSON.stringify(e));
				log.info(JSON.stringify(b));
				reject({ success:false});
			}
		});
	});
};

api_structure.get_access_token = async (s) => {
	try{
		let option 		= api_structure.get_request_option();
		option.method 	= "POST";
		option.url  	+= api_structure.tenant_post_user_url;
		option.body 	= {"id":g_user_id, "password":g_password};
		let response 	= await api_structure.call_api(option);
		if(response){
			log.info("[ SODAS USER GET TOKEN ]");
			if( response.access_token ){
				return response.access_token;
			}
		}else{
			log.error(JSON.stringify(response));
			return response;
		}
	}catch(e){
		log.error(JSON.stringify(e));
		return {success:false};
	}
};

api_structure.price_condtion_save = async (resource_id, price, productCategory, resourceType ) => {
	try{
		let access_token 				= await api_structure.get_access_token();
		let option 						= api_structure.get_request_option();
		option.method 					= "POST";
		option.url  				    = api_structure.price_condtion_save_url;
		option.headers.Authorization 	= access_token;

		let goods						= {};
		goods.goodsId					= resource_id;
		goods.tenantType				= "user";
		goods.servicePeriod				= "365";
		goods.periodUnit				= "days";
		goods.serviceCount				= -1;
		
		goods.validStart				= "2020-01-01";
		goods.validEnd					= "9999-12-31";
		// goods.priceUnit					= "";
		goods.productCategory			= productCategory;
		goods.resourceType				= resourceType;
		// goods.descritpion				= "";
		goods.price 				 	= price
		option.form						= {goods:[goods]};
		console.log(JSON.stringify( option ));
		log.debug("[ SODAS "+productCategory.toUpperCase()+" PRICE CONDITION SAVE ]");

		let response = await api_structure.call_api(option);
		if(response){
			if( response.result && response.result=="success" ){
				return {success:true};
			}
		}else{
			log.error(JSON.stringify(response));
			return response;
		}
	}catch(e){
		log.error(JSON.stringify(e));
		return {success:false};
	}
};

api_structure.price_condtion_update = async (resource_id, price, productCategory, resourceType) => {
	try{
		let access_token 				= await api_structure.get_access_token();
		let option 						= api_structure.get_request_option();
		option.method 					= "GET";
		option.url  				    = api_structure.price_condtion_list_url;
		option.headers.Authorization 	= access_token;

		let params						= {};
		params.goodsIds					= resource_id;
		option.qs						= params;

		console.log(JSON.stringify( option ));
		log.debug("[ SODAS "+productCategory.toUpperCase()+" PRICE CONDITION LIST ]");
		//조회
		let response = await api_structure.call_api(option);

		// {"count":"1","priceconditions":[{"id":"a5bead88-967c-4015-a7e0-7bea2fe8762e","goodsId":"bdd4da00-3058-11ea-8e20-bbcbb9e0d9d2","tenantType":"user","servicePeriod":365,"periodUnit":"days","serviceCount":-1,"validStart":"2020-01-01","validEnd":"9999-12-31","price":999999,"priceUnit":null,"productCategory":"resource","resourceType":"dataset","description":"","issuerId":"sodas_admin","issued":"2020-01-06T07:47:09.691+00:00","modifierId":null,"modified":null}]}
		//조회 된 내용이 없을때 바로 저장
		if(!response || response.count == "0"){
			log.debug("[ SODAS "+productCategory.toUpperCase()+" PRICE CONDITION LIST EMPTY]");
			response = await api_structure.price_condtion_save(resource_id, price, productCategory, resourceType)
			if( !response.success){
				return {success:false};
			}

			return {success:true};
			
		// 조회 된 내용이 있을때 삭제후 다시 등록
		}else{
			option.method 		= "POST";
			option.url  		= api_structure.price_condtion_remove_url;
			
			params				= {};
			params.id			= response.priceconditions[0].id;
			params.goodsId		= response.priceconditions[0].goodsId;
			option.form			= params;
			
			delete option.qs;

			log.debug("[ SODAS "+productCategory.toUpperCase()+" PRICE CONDITION REMOVE ]");
			//삭제
			response = await api_structure.call_api(option);
			if(!response || !response.result || response.result!="success" ) return {success:false};
			
			//저장
			response = await api_structure.price_condtion_save(resource_id, price, productCategory, resourceType)
			if( !response.success){
				return {success:false};
			}
			return {success:true};
		}
	}catch(e){
		log.error(JSON.stringify(e));
		return {success:false};
	}
};

api_structure.price_condtion_delete = async (resource_id, productCategory, resourceType) => {
	try{
		let access_token 				= await api_structure.get_access_token();
		let option 						= api_structure.get_request_option();
		option.method 					= "GET";
		option.url  				    = api_structure.price_condtion_list_url;
		option.headers.Authorization 	= access_token;

		let params						= {};
		params.goodsIds					= resource_id;
		option.qs						= params;

		console.log(JSON.stringify( option ));
		log.debug("[ SODAS "+productCategory.toUpperCase()+" PRICE CONDITION LIST ]");
		//조회
		let response = await api_structure.call_api(option);

		//조회 된 내용이 없을때 바로 저장
		if(!response || response.count == "0") return {success:true};	
		// 조회 된 내용이 있을때 삭제후 다시 등록
		else{
			option.method 		= "POST";
			option.url  		= api_structure.price_condtion_remove_url;
			
			params				= {};
			params.id			= response.priceconditions[0].id;
			params.goodsId		= response.priceconditions[0].goodsId;
			option.form			= params;
			
			delete option.qs;

			log.debug("[ SODAS "+productCategory.toUpperCase()+" PRICE CONDITION REMOVE ]");
			//삭제
			response = await api_structure.call_api(option);
			if(!response || !response.result || response.result!="success" ) return {success:false};
			
			return {success:true};
		}
	}catch(e){
		log.error(JSON.stringify(e));
		return {success:false};
	}
};
module.exports = api_structure;