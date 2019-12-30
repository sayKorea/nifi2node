const request 			= require('request-promise');
const log 				= require("../common/logger");

//  내부 클라우드
const sodas_ip 			= "101.101.166.237";
const sodas_port 		= "3030";

// var sodas_ip 		= "182.173.185.98";
// var sodas_port 		= "3000";

const sodas_prefix 		= "/api/v1";
const sodas_protocol 	= "http";
const sodas_url			= sodas_protocol+"://"+sodas_ip+":"+sodas_port+sodas_prefix;

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

// request 옵션
api_structure.get_request_option = () => {
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
			if (!e && ( r.statusCode == 200 || r.statusCode == 201 )) {
				log.info(JSON.stringify(b));
				resolve(b);
			} else {
				reject({ success:false});
			}
		});
	});
};

api_structure.get_access_token = async (s) => {
	try{
		let option = api_structure.get_request_option();
		option.method = 'POST';
		option.url  += api_structure.tenant_post_user_url;
		option.body = {"id":g_user_id, "password":g_password};
		let response = await api_structure.call_api(option);
		if(response){
			log.info("[ SODAS USER GET TOKEN ]");
			if( response.access_token ){
				log.info(response.access_token);
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

module.exports = api_structure;