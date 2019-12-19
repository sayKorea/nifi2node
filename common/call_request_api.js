var request 		= require('request-promise');
//  내부 클라우드
var sodas_ip 		= "101.101.166.237";
var sodas_port 		= "3030";
// var sodas_ip 		= "182.173.185.98";
// var sodas_port 		= "3000";

// var sodas_ip 		= "182.173.185.98";
// var sodas_port 		= "3000";

var sodas_prefix 	= "/api/v1";
var sodas_protocol 	= "http";
var sodas_url		= sodas_protocol+"://"+sodas_ip+":"+sodas_port+sodas_prefix;

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
		// console.log(option);
		request(option, function (e, r, b) {
			if (e){
				console.log(e);
				console.log(r);
				console.log(b);
			}
			if (!e && ( r.statusCode == 200 || r.statusCode == 201 )) {
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
		option.body = {"id":n_user_id, "password":n_password};
		let response = await api_structure.call_api(option);
		if(response){
			console.log("[ SODAS USER GET TOKEN ]");
			if( response.access_token ){
				return response.access_token;
			}
		}else{
			return response;
		}
	}catch(e){
		console.log(e);
		return {success:false};
	}
};

module.exports = api_structure;