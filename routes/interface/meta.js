const express = require('express');
const dao = require('../../common/commonDao');
const uuid = require('uuid4');
const router = express.Router();


router.get('/', function(req, res, next) {
	res.render('meta/metadata.html');
});

router.get('/his', function(req, res, next) {
	res.render('meta/metadata_history.html');
});


router.get('/repo_list', function(req, res, next) {
	var query = ' SELECT  REPO_NO AS CD';
		query +=' 		, REPO_ID AS CDID';
		query +=' 		, REPO_NM AS CDNM';
		query +=' 		, REPO_DESC AS CDDESC';
		query +=' FROM REPOSITORY';
		query +=' WHERE 1=1';
		query +=' ORDER BY REPO_NO';

	dao.query(query, (e, r) => {
		if(e){
			res.send({success:false});
			throw e;
		}else{
			res.send(r.rows);
		}
	});

});

router.get('/list', function(req, res, next) {
	var metaNm = req.query.metaNm;
	var repoNm = req.query.repoNm;

	var query  =" SELECT      A.META_NO     			";
		query +=" 			, B.REPO_NO     			";
		query +=" 			, B.REPO_NM     			";
		query +=" 			, B.REPO_DESC     			";
		query +=" 			, A.META_NM 				";
		query +=" 			, A.META_DESC 				";
		query +=" 			, A.META_LICENSE 			";
		query +=" 			, A.META_AUTH 				";
		query +=" 			, A.META_SOURCE_HOST 		";
		query +=" 			, A.META_SOURCE_PATH 		";
		query +=" 			, A.META_SOURCE_NIFI_API_URL";
		query +=" 			, A.META_TARGET_HOST 		";
		query +=" 			, A.META_TARGET_PATH 		";
		query +=" 			, A.META_TARGET_NIFI_API_URL";
		query +=" 			, A.META_VALID_STR 			";
		query +=" 			, A.META_SOURCE_PATH_TYPE 	";
		query +=" 			, A.META_TARGET_PATH_TYPE 	";
		query +=" 			, A.REG_ID 					";
		query +=" 			, A.REG_DT 					";
		query +=" 			, A.MOD_ID 					";
		query +=" 			, A.MOD_DT                	";
		query +=" FROM META_DATA A, REPOSITORY B    	";
		query +=" WHERE A.REPO_NO = B.REPO_NO			";
		//if(repoNm && repoNm != "") query +=" AND REPO_NM LIKE '%"+ repoNm +"%'";
		//if(repoType && repoType != "") query +=" AND REPO_TYPE = '"+repoType+"'";
		query +=" ORDER BY META_NO";

	dao.query(query, (e, r) => {
		if(e){
			res.send({success:false});
			throw e;
		}else{
			res.send(r.rows);
		}

	});
});


router.get('/detail_list', function(req, res, next) {
	var metaNo = req.query.metaNo;

	var query  =" SELECT      A.META_NO     			";
		query +=" 			, B.REPO_NO     			";
		query +=" 			, B.REPO_NM     			";
		query +=" 			, B.REPO_DESC     			";
		query +=" 			, A.META_NM 				";
		query +=" 			, A.META_DESC 				";
		query +=" 			, A.META_LICENSE 			";
		query +=" 			, A.META_AUTH 				";
		query +=" 			, A.META_SOURCE_HOST 		";
		query +=" 			, A.META_SOURCE_PORT 		";
		query +=" 			, A.META_SOURCE_USER 		";
		query +=" 			, A.META_SOURCE_PASS 		";
		query +=" 			, A.META_SOURCE_PATH 		";
		query +=" 			, A.META_SOURCE_NIFI_API_URL";
		query +=" 			, A.META_TARGET_HOST 		";
		query +=" 			, A.META_TARGET_PORT 		";
		query +=" 			, A.META_TARGET_USER 		";
		query +=" 			, A.META_TARGET_PASS 		";
		query +=" 			, A.META_TARGET_PATH 		";
		query +=" 			, A.META_TARGET_NIFI_API_URL";
		query +=" 			, A.META_VALID_STR 			";
		query +=" 			, A.META_SOURCE_PATH_TYPE 	";
		query +=" 			, A.META_TARGET_PATH_TYPE 	";
		query +=" 			, A.REG_ID 					";
		query +=" 			, A.REG_DT 					";
		query +=" 			, A.MOD_ID 					";
		query +=" 			, A.MOD_DT                	";
		query +=" FROM META_DATA A, REPOSITORY B    	";
		query +=" WHERE A.REPO_NO = B.REPO_NO			";
		query +=" AND A.META_NO ="+metaNo;
		//if(repoNm && repoNm != "") query +=" AND REPO_NM LIKE '%"+ repoNm +"%'";
		//if(repoType && repoType != "") query +=" AND REPO_TYPE = '"+repoType+"'";
		query +=" ORDER BY META_NO";
	console.log(query);
	dao.query(query, (e, r) => {
		if(e){
			res.send({success:false});
			throw e;
		}else{
			res.send(r.rows);
		}

	});
});

router.get('/history_list', function(req, res, next) {
	var repoNm = req.query.repoNm;
	var repoType = req.query.repoType;

	var query = ' SELECT  REPO_HIS_NO';
		query +=' 		, REPO_HIS_TYPE';
		query +=' 		, REPO_ID';
		query +=' 		, REPO_ID';
		query +=' 		, REPO_NM';
		query +=' 		, REPO_DESC';
		query +=' 		, REPO_TYPE';
		query +=' 		, REPO_VOLUME';
		query +=' 		, ACC_TOKEN';
		query +=' 		, REG_ID';
		query +=' 		, TO_CHAR(REG_DT, \'YYYY-MM-DD\') AS REG_DT';
		query +=' 		, MOD_ID';
		query +=' 		, MOD_DT';
		query +=' FROM REPOSITORY_HISTORY';
		query +=' WHERE 1=1';
		if(repoNm && repoNm != "") query +=" AND REPO_NM LIKE '%"+ repoNm +"%'";
		if(repoType && repoType != "") query +=" AND REPO_TYPE = '"+repoType+"'";
		query +=' ORDER BY REPO_NO';
	console.log(query);
	dao.query(query, (e, r) => {
		console.log(r);
		res.send(r.rows);
	});
});

router.post('/save', function(req, res, next) {
	console.log(req.body);
	var repoNo			= req.body.repoNo;
	var metaNm			= req.body.metaNm;
	var metaDesc		= req.body.metaDesc;
	var srcHost			= req.body.srcHost;
	var srcPort			= req.body.srcPort;
	var srcUser			= req.body.srcUser;
	var srcPass			= req.body.srcPass;
	var srcPath			= req.body.srcPath;
	var srcSetApiUrl	= req.body.srcSetApiUrl;
	var tgtHost			= req.body.tgtHost;
	var tgtPort			= req.body.tgtPort;
	var tgtUser			= req.body.tgtUser;
	var tgtPass			= req.body.tgtPass;
	var tgtPath			= req.body.tgtPath;
	var tgtSetApiUrl	= req.body.tgtSetApiUrl;
	var validJson		= req.body.validJson;
	var regId		= "admin";
	// var valid = true;
	// if(!repoNm || repoNm == "") valid = false;
	// if(!repoType || repoType  == "") valid = false;
	// if(!repoVolume || repoVolume == "") valid = false;
	// if(!valid) res.send({success:false});
	
	var insert  = " INSERT INTO meta_data(repo_no, meta_nm, meta_desc, meta_source_host, meta_source_port, meta_source_user, meta_source_pass, meta_source_path, meta_source_nifi_api_url, meta_target_host, meta_target_port, meta_target_user, meta_target_pass, meta_target_path, meta_target_nifi_api_url, meta_valid_str,reg_id)";
		insert += " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)";
	var params = [repoNo, metaNm, metaDesc, srcHost, srcPort, srcUser,srcPass,srcPath,srcSetApiUrl,tgtHost,tgtPort,tgtUser,tgtPass,tgtPath,tgtSetApiUrl,validJson,regId];
	
	//console.log(query,params);
	dao.query(insert ,params , (e, r) => {
		if(e){
			res.send({success:false});
			throw e;
		}else{
			res.send({success:true});
		}
	});

	// var insert_history  = "INSERT INTO REPOSITORY_HISTORY(REPO_HIS_TYPE, REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT) ";
	// 	insert_history += " SELECT 'insert', REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT  FROM REPOSITORY WHERE REPO_ID=$1 AND REPO_NM=$2"; 
	// var params_history = [repoId, repoNm];

	// //console.log(query,params);
	// dao.query(insert_history,params_history , (e, r) => {
	// 	if(e){
	// 		res.send({success:false});
	// 		throw e;
	// 	}else{
	// 		res.send({success:true});
	// 	}
	// });
});


router.post('/update', function(req, res, next) {
	console.log(req.body);
	var metaNo			= req.body.mMetaNo;
	var repoNo			= req.body.mRepoNo;
	var metaNm			= req.body.mMetaNm;
	var metaDesc		= req.body.mMetaDesc;
	var srcHost			= req.body.mSrcHost;
	var srcPort			= req.body.mSrcPort;
	var srcUser			= req.body.mSrcUser;
	var srcPass			= req.body.mSrcPass;
	var srcPath			= req.body.mSrcPath;
	var srcSetApiUrl	= req.body.mSrcSetApiUrl;
	var tgtHost			= req.body.mTgtHost;
	var tgtPort			= req.body.mTgtPort;
	var tgtUser			= req.body.mTgtUser;
	var tgtPass			= req.body.mTgtPass;
	var tgtPath			= req.body.mTgtPath;
	var tgtSetApiUrl	= req.body.mTgtSetApiUrl;
	var validJson		= req.body.mValidJson;
	// var valid = true;
	// if(!repoNm || repoNm == "") valid = false;
	// if(!repoType || repoType  == "") valid = false;
	// if(!repoVolume || repoVolume == "") valid = false;
	// if(!valid) res.send({success:false});
	
	var update =  " UPDATE META_DATA SET           ";
		update += " 	REPO_NO=$1,                  ";
		update += " 	META_NM=$2,                  ";
		update += " 	META_DESC=$3,                ";
		update += " 	META_SOURCE_HOST=$4,         ";
		update += " 	META_SOURCE_PORT=$5,         ";
		update += " 	META_SOURCE_USER=$6,         ";
		update += " 	META_SOURCE_PASS=$7,         ";
		update += " 	META_SOURCE_PATH=$8,         ";
		update += " 	META_SOURCE_NIFI_API_URL=$9, ";
		update += " 	META_TARGET_HOST=$10,        ";
		update += " 	META_TARGET_PORT=$11,        ";
		update += " 	META_TARGET_USER=$12,        ";
		update += " 	META_TARGET_PASS=$13,        ";
		update += " 	META_TARGET_PATH=$14,        ";
		update += " 	META_TARGET_NIFI_API_URL=$15,";
		update += " 	META_VALID_STR=$16           ";
		update += " WHERE META_NO ="+metaNo;
	var params = [repoNo, metaNm, metaDesc, srcHost, srcPort, srcUser,srcPass,srcPath,srcSetApiUrl,tgtHost,tgtPort,tgtUser,tgtPass,tgtPath,tgtSetApiUrl,validJson];
	
	//console.log(query,params);
	dao.query(update ,params , (e, r) => {
		if(e){
			res.send({success:false});
			throw e;
		}else{
			res.send({success:true});
		}
	});

	// var insert_history  = "INSERT INTO REPOSITORY_HISTORY(REPO_HIS_TYPE, REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT) ";
	// 	insert_history += " SELECT 'insert', REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT  FROM REPOSITORY WHERE REPO_ID=$1 AND REPO_NM=$2"; 
	// var params_history = [repoId, repoNm];

	// //console.log(query,params);
	// dao.query(insert_history,params_history , (e, r) => {
	// 	if(e){
	// 		res.send({success:false});
	// 		throw e;
	// 	}else{
	// 		res.send({success:true});
	// 	}
	// });
});
module.exports = router;
