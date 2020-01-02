const express 	= require("express");
const router 	= express.Router();
const log 		= require("../../common/logger");
const log 		= require("../../common/logger");
const multer 	= require("multer");
const fStorage 	= require("multer-ftp");
const sStorage 	= require("multer-sftp");
const Client 	= require("ssh2-sftp-client");
const path 		= require("path");
const SftpUpload= require("sftp-upload");
const fs 		= require("fs");
const util 		= require('util');
const readdir 	= util.promisify(fs.readdir);

const cps		= require("child_process").spawn;
const exec 		= util.promisify(require('child_process').exec);

const lDir		= "uploads/";
const rDir		= "./app/uploads/";

const local = multer({
	dest: "/", limits: { fileSize: 5 * 1024 * 1024 * 1024 },
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

// const sftp = multer({
// 	storage: new sStorage({
// 		basepath: "/app/uploads",
// 		sftp: {
// 			  host: "192.168.1.94",
// 			  port: 22,
// 			  username: "master",
// 			  password: "qweasd123!@#"
// 		},
// 		destination: "./app",
// 		filename: function (req, file, cb) {
// 			cb(null, file.originalname);
// 		}
// 	})
// }).single("mfile");

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
		return sftp.put(pt, "/app/uploads/"+fileName,[false],null);
	}).then(data => {
		console.log(data, 'the data info');
		sftp.end().then(r =>{
			var ls = cps("ls", ["/app/uploads/","-a"]);

			ls.stdout.on('data', function(data) {
				console.log('stdout: ' + data);
			});
			
			ls.stderr.on('data', function(data) {
				console.log('stderr: ' + data);
			});
			
			ls.on('exit', function(code) {
				console.log('exit: ' + code);
			});
		}).then(r =>{
			var ls = cps("ps", ["-ef"]),
			grep = cps('grep', ['node']);

			ls.stdout.on('data', function(data) {
				grep.stdin.write(data);
				//console.log('stdout: ' + data);
			});
			
			ls.stderr.on('data', function(data) {
				console.log('stderr: ' + data);
			});
			
			ls.on('exit', function(code) {
				console.log('exit: ' + code);
				grep.stdin.end();
			});
			
			grep.stdout.on('data', function (data) { 
				console.log('' + data); 
				var ps = data.toString();
				var logArray = ps.split("\n");
				
				console.log(ps);
				console.log(logArray);
				
				logArray.forEach((e,i,a) =>{
					if(e =="" ) return true;
					console.log(i+"  "+ e);
				});
			}); 
			grep.stderr.on('data', function (data) { 
				console.log('grep stderr: ' + data); 
			}); 
			grep.on('exit', function (code) { if (code !== 0) { 
				console.log('grep process exited with code ' + code); } 
			});
		});
	}).catch(err => {
		console.log(err, 'catch error');
		sftp.end();
	});

	

	// sftp.connect({
	// 	host: '192.168.1.94', 
	// 	port: '22',
	// 	username: 'master',
	// 	password: 'qweasd123!@#',
	// 	debug:true
	// }).then(() => {
	// 	return sftp.put(pt, "/app/uploads/"+fileName,[false],null);
	// }).then(data => {
	// 	console.log(data, 'the data info');
	// 	sftp.end();
	// }).catch(err => {
	// 	console.log(err, 'catch error');
	// 	sftp.end();
	// });

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
});


// router.get("/getFiles", async(req, res, next) => {
// 	var dir_path = "/apps/uploads/";
// 	var ls = cps("ls", [dir_path,"-a"]);

// 	ls.stdout.on('data', function(data) {
// 		var s = data+"";
// 		var sa = s.split("\n");
// 		console.log(sa[3]);
// 		var file_list = {path:dir_path,files:[]};
// 		sa.forEach((e,i)=>{
// 			if(i<2) return true;
// 		});

// 		if(e.trim() == "") return true;
// 		console.log(e);
// 		file_list.files.push(e);	
		
// 		console.log(file_list);
// 		res.send(file_list);
// 	});
	
// 	ls.stderr.on('data', function(data) {
// 		console.log('stderr: ' + data);
// 		console.log(data);
// 		res.send({success:false});
// 	});
	
// 	ls.on('exit', function(code) {
// 		console.log('exit: ' + code);
// 	});
// });

router.get("/getFiles2", async(req, res, next) => {
	var dir_path = "/apps/uploads/";
	console.log("전체 목록");
	var ec = await exec_commmand("ls -l "+dir_path);
	console.log(ec);
	
	console.log("파일 목록");
	ec = await exec_commmand("ls -l "+dir_path+" | grep -v ^d");
	//console.log(ec);
	var fileList = ec.split("\n");
	
	console.log(fileList);
	
	
	fileList.forEach((e,i)=>{
		var temp = e.split(" ");
		console.log(temp[temp.length-1]);
	});
	
	st.forEach((e,i)=>{
		console.log(e);
	});
	console.log("디렉토리 목록");
	ec = await exec_commmand("ls -l "+dir_path+" | grep ^d");
	console.log(ec);
	var st = ec.split(" ");
	console.log(st[st.length-1]);
	//st.forEach((e,i)=>{
	//	console.log(e);
	//});
	//var ec = await exec_commmand("ls", [dir_path,"-a"]);
	//console.log(ec);
});


async function exec_commmand(cmd) {
	console.log(cmd);
	var dir_path = "/apps/uploads/";
	const { stdout, stderr } = await exec(cmd);
	//console.log('stdout:', stdout);
	console.error('stderr:', stderr);
	return stdout;
};


router.get("/getFiles", async(req, res, next) => {
	let dir_path = "/apps/uploads/";
	
	// var list = await fs.readdir(dir_path,(error, filelist) => {
	// //   console.log(filelist);
	//   return this.fileList;
	// });
	let list = await get_file_list(dir_path);
	let file_list = [];
	if(list){
		// console.log(list);
		
		list.forEach((e,i) =>{
			if( !fs.lstatSync(dir_path+e).isDirectory() ) {
				file_list.push(e);
			}
		});
	}
	console.log(file_list);

	res.send(file_list);
});

module.exports = router;
