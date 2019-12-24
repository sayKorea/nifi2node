const express 	= require("express");
const router 	= express.Router();
const log 		= require("../../common/logger");
const multer 	= require("multer");
const fStorage 	= require("multer-ftp");
const sStorage 	= require("multer-sftp");
const path 		= require("path");
const SftpUpload= require('sftp-upload');
const fs 		= require('fs');

const lDir		= "uploads/";
const rDir		= "./app/uploads/";

let Client = require("ssh2-sftp-client");

const local = multer({
	dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 * 1024 },
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, lDir);
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		}
	})
}).single("mfile");

// const ftp = multer({
// 	storage: new fStorage({
// 		basepath: "/app/uploads",
// 		ftp: {
// 			host: "192.168.1.94",
// 			secure: false,
// 			user: "master",
// 			password: "qweasd123!@#"
// 		},
// 		destination: function (req, file, options, callback) {
// 			callback(null, path.join(options.basepath, file.originalname))
// 		}
// 	})
// }).single("mfile");

const sftp = multer({
	storage: new sStorage({
		basepath: "/app/uploads",
		sftp: {
			  host: "192.168.1.94",
			  port: 22,
			  username: "master",
			  password: "qweasd123!@#"
		},
		destination: "./app",
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		}
	})
}).single("mfile");



  


//const upload = multer();

// Uploads Multipart
// router.post('/', uploads.single("mfile"), (req, res) => {
// 	//console.log(req);
// 	console.log(req.file); 
// 	res.send({success:true});
// });


// router.post('/', uploads.single("mfile"), (req, res) => {
// 	//console.log(req);
// 	console.log(req.file);
// 	res.send({ success: true });
// });

let exe_upload = async(req, res) =>{
	return new Promise((resolve, reject) => {
		// option.url = sodas_url+option.url;
		// log.info(JSON.stringify(option));
		// request(option, function (e, r, b) {
		// 	if (e){
		// 		// console.log(e);
		// 		// console.log(r);
		// 		// console.log(b);
		// 		log.error(JSON.stringify(e));
		// 	}
		// 	if (!e && ( r.statusCode == 200 || r.statusCode == 201 )) {
		// 		log.info(JSON.stringify(b));
		// 		resolve(b);
		// 	} else {
		// 		reject({ success:false});
		// 	}
		// });

		local(req, res, err => {
			if (err) {
				//console.log("Error uploading file - " + err);
				
				reject(err);
			} else {
				resolve(req.file);
			}
		});

	});
};

router.post("/", async(req, res, next) => {
	let fileName = "";
	// let rtn = await local(req, res, err => {
	// 	if (err) {
	// 		console.log("Error uploading file - " + err);
	// 		return err;
	// 	} else {
	// 		console.log(req.file);
	// 		//console.log("File is uploaded - " + JSON.stringify(req.file));
	// 		fileName = req.file.originalname;
	// 		return req.file;
	// 	}
	// });

	let rtn = await exe_upload(req, res);
	console.log(rtn.filename);
	fileName = rtn.filename;
	// ftp(req, res, function (err) {
	// 	if (err) {
	// 		console.log("Error uploading file - " + err);
	// 	} else {
	// 		console.log("File is uploaded - " + JSON.stringify(req.file));
	// 	}
	// })

	// sftp(req, res, function (err) {
	// 	if (err) {
	// 		console.log("Error uploading file - " + err);
	// 	} else {
	// 		console.log(req.file);
	// 		console.log("File is uploaded - " + JSON.stringify(req.file));
	// 	}
	// })

	console.log(path.join(__dirname, "../../uploads/",fileName));

	let pt = path.join(__dirname, "../../uploads/",fileName);
	let sftp = new Client();

	
	const file = fs.createWriteStream(pt);

	console.log(file);

	sftp.connect({
		host: '192.168.1.94',
		port: '22',
		username: 'master',
		password: 'qweasd123!@#',
		debug:true
	}).then(() => {
		return sftp.put(pt, "./app/uploads/"+fileName,[false],null);
	}).then(data => {
		console.log(data, 'the data info');
		sftp.end();
	}).catch(err => {
		console.log(err, 'catch error');
		sftp.end();
	});

	// sftp.connect({
	// 	host: '192.168.1.94',
	// 	port: '22',
	// 	username: 'master',
	// 	password: 'qweasd123!@#'
	// }).then(() => {
	// 	return sftp.list('/home/master');
	// }).then(data => {
	// 	console.log(data, 'the data info');
	// }).catch(err => {
	// 	console.log(err, 'catch error');
	// });

	// var options = {
    //     host:"192.168.1.94",
    //     username:"master",
    //     path: "/",
    //     remoteDir: path.join(__dirname, "../../uploads/",fileName)
    //    // excludedFolders: ['./.git', 'node_modules'],
    //     //privateKey: fs.readFileSync('privateKey_rsa'),
   	//  	//passphrase: fs.readFileSync('privateKey_rsa.passphrase')
	// };

	// try{
	// 	var sftp = new SftpUpload(options);
	
	// 	sftp.on('error', function(err) {
	// 		throw err;
	// 	})
	// 	.on('uploading', function(progress) {
	// 		console.log('Uploading', progress.file);
	// 		console.log(progress.percent+'% completed');
	// 	})
	// 	.on('completed', function() {
	// 		console.log('Upload Completed');
	// 	})
	// 	.upload();
	// } catch(e){
	// 	console.log(e);
	// }
	res.send({success:true});
});




















module.exports = router;
