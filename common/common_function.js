const PropertiesReader 	= require("properties-reader");
const fs 				= require("fs");
const util 				= require('util');
const readdir 			= util.promisify(fs.readdir);
const log 				= require("../common/logger");

let common_function		= {};

common_function.get_dir_list = async(path, option) =>{
	//option
	// "d" : directory only
	// "f" : file only
	// else : all list
	try{
		let temp_list = await get_file_list(path);
		let list = [];
		if(temp_list){
			temp_list.forEach((e,i) =>{
				if(option){
					if(option == "f"){
						if( !fs.lstatSync(path+e).isDirectory() ) {
							list.push(e);
						}
					} else if(option == "d"){
						if( fs.lstatSync(path+e).isDirectory() ) {
							list.push(e);
						}
					} else if(option == "a"){
						list.push(e);
					}
				}
			});
		}
		return list;
	}catch(e){
		log.debug(JSON.stringify(e));
		return null;
	}
};

let get_file_list = async (path) => {
	let list;
	try {
		list = await readdir(path);
	} catch (err) {
		log.error(JSON.stringify(err));
		return null;
		
	}
	if (list === undefined) {
		log.error(dir + " file list undefined");
		return null;
	}
	return list;
}

module.exports = common_function;