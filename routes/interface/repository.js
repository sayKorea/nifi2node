const express = require('express');
const dao = require('../../common/commonDao');
const uuid = require('uuid4');
const router = express.Router();


router.get('/', function(req, res, next) {
	res.render('repository/repository.html');
});

// router.get('/his', function(req, res, next) {
// 	res.render('repository/repository_history.html');
// });

router.get('/list', async (req, res, next)  => {
	console.log(req.query);
	var repo_nm = req.query.s_repo_nm;
	var repo_type = req.query.s_repo_type;
	var queryResult;
	var query = " SELECT  REPO_NO";
		query +=" 		, REPO_CENTER_ID";
		query +=" 		, REPO_NM";
		query +=" 		, REPO_DESC";
		query +=" 		, CASE WHEN REPO_TYPE='public' THEN '외부'";
		query +=" 		       WHEN REPO_TYPE='private' THEN '내부' ";
		query +=" 		       ELSE '' END AS REPO_TYPE";
		query +=" 		, REPO_VOLUME";
		query +=" 		, REPO_SOURCE_PATH";
		query +=" 		, REPO_TARGET_PATH";
		query +=" 		, REG_ID";
		query +=" 		, TO_CHAR(REG_DT, 'YYYY-MM-DD') AS REG_DT";
		query +=" 		, MOD_ID";
		query +=" 		, MOD_DT";
		query +=" FROM REPOSITORY";
		query +=" WHERE 1=1";
		if(repo_nm && repo_nm != "") query +=" AND REPO_NM LIKE '%"+ repo_nm +"%'";
		if(repo_type && repo_type != "") query +=" AND REPO_TYPE = '"+repo_type+"'";
		query +=' ORDER BY REPO_NO DESC';

	// dao.query(query, (e, r) => {
	// 	console.log(r.rows);
	// 	res.send(r.rows);
	// });

	queryResult = await callDb(query);
	if(queryResult){
		console.log(queryResult);
		res.send(queryResult.rows);
	}else{
		res.send({});
	}
	
});

router.get('/his_list', function(req, res, next) {
	console.log(req.query);
	var repoNm = req.query.repoNm;
	var repoType = req.query.repoType;

	var query = " SELECT  REPO_HIS_NO";
		query +=" 		, CASE 	WHEN REPO_HIS_TYPE='insert' THEN '등록'";
		query +=" 				WHEN REPO_HIS_TYPE='update' THEN '수정'";
		query +=" 		 		WHEN REPO_HIS_TYPE='delete' THEN '삭제'";
		query +=" 		 	   	ELSE '' END AS REPO_HIS_TYPE";
		query +=" 		, REPO_ID";
		query +=" 		, REPO_ID";
		query +=" 		, REPO_NM";
		query +=" 		, REPO_DESC";
		query +=" 		, REPO_TYPE";
		query +=" 		, REPO_VOLUME";
		query +=" 		, ACC_TOKEN";
		query +=" 		, REG_ID";
		query +=" 		, TO_CHAR(REG_DT, 'YYYY-MM-DD') AS REG_DT";
		query +=" 		, MOD_ID";
		query +=" 		, MOD_DT";
		query +=" FROM REPOSITORY_HISTORY";
		query +=" WHERE 1=1";
		if(repoNm && repoNm != "") query +=" AND REPO_NM LIKE '%"+ repoNm +"%'";
		if(repoType && repoType != "") query +=" AND REPO_TYPE = '"+repoType+"'";
		query +=" ORDER BY REPO_NO DESC";
	dao.query(query, (e, r) => {
		res.send(r.rows);
	});
});

router.post('/save', async function(req, res, next) {
	console.log(req.body);
	var repo_nm 			= req.body.repo_nm;
	var repo_center_id 		= req.body.repo_center_id;
	var repo_source_path 	= req.body.repo_source_path;
	var repo_target_path 	= req.body.repo_target_path;
	var repo_desc 			= req.body.repo_desc;
	var repo_type 			= req.body.repo_type;
	var reg_id				= "admin";

	var valid = true;
	if(!repo_nm || repo_nm == "") valid = false;
	if(!repo_center_id || repo_center_id == "") valid = false;
	if(!repo_source_path || repo_source_path  == "") valid = false;
	if(!repo_target_path || repo_target_path == "") valid = false;
	if(!repo_type || repo_type == "") valid = false;
	if(!valid) res.send({success:false});

	var insert  = "INSERT INTO REPOSITORY (REPO_CENTER_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_SOURCE_PATH, REPO_TARGET_PATH, REG_ID) VALUES ( $1, $2, $3, $4, $5, $6, $7  ); ";
	var params = [repo_center_id, repo_nm, repo_desc, repo_type, repo_source_path, repo_target_path, reg_id];

	// var insert_history  = "INSERT INTO REPOSITORY_HISTORY(REPO_HIS_TYPE, REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT) ";
	// 	insert_history += " SELECT 'insert', REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT  FROM REPOSITORY WHERE REPO_ID=$1 AND REPO_NM=$2"; 
	// var params_history = [repoId, repoNm];

	//저장소 등록
	//console.log(query,params);
	// dao.query(insert ,params , (e, r) => {
	// 	if(e){
	// 		res.send({success:false});
	// 		throw e;
	// 	}
	// });

	//저장소 이력 등록
	//console.log(query,params);
	var queryResult = await callDb(insert, params);
	if(queryResult){
		console.log(queryResult);
		res.send({success:true});
	}else{
		res.send({success:false});
	}
});

router.post('/del', async function(req, res, next) {
	console.log(req.body);
	var repo_no 	= req.body.repo_no;
	var valid = true;
	if(!repo_no) valid = false;
	if(!valid) res.send({success:false});

	var repo_delete  = "DELETE FROM REPOSITORY WHERE REPO_NO = "+repo_no;

	//저장소 이력 등록
	//console.log(query,params);
	var queryResult = await callDb(repo_delete);
	if(queryResult){
		console.log(queryResult);
		res.send({success:true});
	}else{
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
