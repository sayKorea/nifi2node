const express = require('express');
const dao = require('../../common/commonDao');
const uuid = require('uuid4');
const router = express.Router();


router.get('/', function(req, res, next) {
	res.render('load/load.html');
});

router.get('/his', function(req, res, next) {
	res.render('load/load_history.html');
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

router.get('/meta_list', function(req, res, next) {
	console.log(req.query);
	var repoNo = req.query.repo_no;

	var query = ' SELECT  A.META_NO AS CD';
		query +=' 		, A.META_NM AS CDNM';
		query +=' 		, B.REPO_NO AS PCD';
		query +=' 		, B.REPO_NM AS PCDNM';
		query +=' FROM META_DATA A, REPOSITORY B';
		query +=' WHERE A.REPO_NO = B.REPO_NO';
		if(repoNo && repoNo != "") query +=" AND B.REPO_NO='"+repoNo+"'" ;
		query +=' ORDER BY META_NO';
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


router.get('/list', function(req, res, next) {
	console.log(req.query);
	var repoNm = req.query.repoNm;
	var metaNm = req.query.metaNm;
	var loadNo = req.query.data_load_no;
	
	var query  = " SELECT 	  A.DATA_LOAD_NO 	  	";
		query += " 			, B.REPO_NO 		  	";
		query += " 			, B.REPO_NM 		  	";
		query += " 			, C.META_NO 		  	";
		query += " 			, C.META_NM 		  	";
		query += " 			, A.JOB_NM 		  		";
		query += " 			, A.JOB_DESC 		  	";
		query += " 			, A.JOB_EXE_RESULT  	";
		query += " 			, A.JOB_EXE_TYPE 	  	";
		query += " 			, A.JOB_EXE_UNIT 	  	";
		query += " 			, A.JOB_EXE_UNIT_VAL	";
		query += " 			, A.JOB_EXE_TIME 	  	";
		query += " 			, A.JOB_START_TIME  	";
		query += " 			, A.JOB_END_TIME 	  	";
		query += " 			, A.REG_ID		  		";
		query += " 			, A.REG_DT		  		";
		query += " 			, A.MOD_ID		  		";
		query += " 			, A.MOD_DT	      		";
		query += " FROM DATA_LOAD A, REPOSITORY B, META_DATA C";
		query += " WHERE A.REPO_NO=B.REPO_NO                  ";
		query += " AND   A.META_NO=C.META_NO                  ";
		if(loadNo && loadNo != "") query +=" AND A.DATA_LOAD_NO="+loadNo;
		if(repoNm && repoNm != "") query +=" AND B.REPO_NM LIKE '%"+ repoNm +"%'";
		if(metaNm && metaNm != "") query +=" AND C.META_NM LIKE '%"+ metaNm +"%'";
		query +=" ORDER BY DATA_LOAD_NO";

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
	var metaNo			= req.body.metaNo;
	var jobNm			= req.body.jobNm;
	var jobDesc			= req.body.jobDesc;
	var jobExeUnit		= req.body.jobExeUnit;
	var jobExeUnitVal	 = req.body.jobExeUnitVal;
	var regId			= "admin";
	// var valid = true;
	// if(!repoNm || repoNm == "") valid = false;
	// if(!repoType || repoType  == "") valid = false;
	// if(!repoVolume || repoVolume == "") valid = false;
	// if(!valid) res.send({success:false});
	
	var insert  = " INSERT INTO DATA_LOAD ( REPO_NO, META_NO, JOB_NM, JOB_DESC,JOB_EXE_RESULT, JOB_EXE_UNIT, JOB_EXE_UNIT_VAL, REG_ID)";
		insert += " VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
	var params = [repoNo, metaNo, jobNm, jobDesc, '', jobExeUnit, jobExeUnitVal,regId];
	
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
