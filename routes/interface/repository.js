const express = require('express');
const dao = require('../../common/commonDao');
const uuid = require('uuid4');
const router = express.Router();


router.get('/', function(req, res, next) {
	res.render('repository/repository.html');
});

router.get('/his', function(req, res, next) {
	res.render('repository/repository_history.html');
});

router.get('/list', function(req, res, next) {
	var repoNm = req.query.repoNm;
	var repoType = req.query.repoType;

	var query = ' SELECT  REPO_NO';
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
		query +=' FROM REPOSITORY';
		query +=' WHERE 1=1';
		if(repoNm && repoNm != "") query +=" AND REPO_NM LIKE '%"+ repoNm +"%'";
		if(repoType && repoType != "") query +=" AND REPO_TYPE = '"+repoType+"'";
		query +=' ORDER BY REPO_NO';

	dao.query(query, (e, r) => {
		console.log(r.rows);
		res.send(r.rows);
	});
});

router.get('/his_list', function(req, res, next) {
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
		query +=" ORDER BY REPO_NO";
	console.log(query);
	dao.query(query, (e, r) => {
		console.log(r);
		res.send(r.rows);
	});
});

router.post('/save', function(req, res, next) {
	console.log(req.body);
	var repoId		= uuid();
	var repoNm 		= req.body.repoNm;
	var repoDesc 	= req.body.repoDesc;
	var repoType 	= req.body.repoType;
	var repoVolume	= req.body.repoVolume;
	var regId		= "admin";


	var valid = true;
	if(!repoNm || repoNm == "") valid = false;
	if(!repoType || repoType  == "") valid = false;
	if(!repoVolume || repoVolume == "") valid = false;
	if(!valid) res.send({success:false});

	var insert  = "INSERT INTO REPOSITORY (REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID) VALUES ( $1, $2, $3, $4, $5, $6 ); ";
	var params = [repoId, repoNm, repoDesc, repoType, repoVolume, regId];

	var insert_history  = "INSERT INTO REPOSITORY_HISTORY(REPO_HIS_TYPE, REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT) ";
		insert_history += " SELECT 'insert', REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT  FROM REPOSITORY WHERE REPO_ID=$1 AND REPO_NM=$2"; 
	var params_history = [repoId, repoNm];


	//저장소 등록
	//console.log(query,params);
	dao.query(insert ,params , (e, r) => {
		if(e){
			res.send({success:false});
			throw e;
		}
	});

	//저장소 이력 등록
	//console.log(query,params);
	dao.query(insert_history,params_history , (e, r) => {
		if(e){
			res.send({success:false});
			throw e;
		}else{
			res.send({success:true});
		}
	});
});

module.exports = router;
