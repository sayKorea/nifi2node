const express 			= require("express");
const PropertiesReader 	= require("properties-reader");
const multer 			= require("multer");
const fStorage 			= require("multer-ftp");
const sStorage 			= require("multer-sftp");
const Client 			= require("ssh2-sftp-client");
const path 				= require("path");
const SftpUpload		= require("sftp-upload");
const router 			= express.Router();
const log 				= require("../../common/logger");
const cf 				= require("../../common/common_function");


// const local = multer({
// 	dest: "/", limits: { fileSize: 5 * 1024 * 1024 * 1024 },
// 	storage: multer.diskStorage({
// 		destination: function (req, file, cb) {
// 			cb(null, lDir);
// 		},
// 		filename: function (req, file, cb) {
// 			cb(null, file.originalname);
// 		}
// 	})
// }).single("mfile");

let exe_upload = async(req, res, local) =>{
	return new Promise((resolve, reject) => {
		local(req, res, err => {
			if (err) {
				reject(err);
			} else {
				resolve(req.file);
			}
		});
	});
};

router.post("/", async(req, res, next) => {
	try{
		const properties 		= PropertiesReader("env.properties");
		let file_source_path 	= properties.get("center.source_path");
		const local = multer({
			dest: "/", limits: { fileSize: 5 * 1024 * 1024 * 1024 },
			storage: multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, file_source_path);
				},
				filename: function (req, file, cb) {
					cb(null, file.originalname);
				}
			})
		}).single("mfile");

		let rtn 				= await exe_upload(req, res, local);
		if(!rtn.size){
			res.send({success:false});
		}
		console.log(rtn);
		log.debug("## Upload Server Path	: "+ rtn.destination);
		log.debug("## Upload Local Path 	: "+ rtn.path);
		log.debug("## Upload File Name 	: "+ rtn.filename);
		log.debug("## Upload File Size 	: "+ rtn.size+" bytes");
		log.debug("## Upload File Mime 	: "+ rtn.mimetype);
		
		// let exist_file = file_source_path+rtn.filename;
		// fs.existsAsync = (exist_file)=>{
		// 	return fs.openAsync(exist_file, "r").then(function(stats){
		// 	  	return res.send({success:true});
		// 	}).catch(function(stats){
		// 		return res.send({success:false});
		// 	})
		// };
		res.send({success:true});
	}catch(e){
		log.debug(JSON.stringify(e));
		res.send({success:false});
	}
});

router.get("/getFiles", async(req, res, next) => {
	const properties 		= PropertiesReader("env.properties");
	const file_source_path 	= properties.get("center.source_path")+"/";
	let list;
	var type = req.query.type;

	if(!type && type.trim() == ""){
		return res.send({success:false,message:"not found type!"});
	}

	list = await cf.get_dir_list(file_source_path,type);
	log.debug(JSON.stringify(list));
	res.send(list);
});

module.exports = router;
