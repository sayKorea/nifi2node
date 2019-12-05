const express = require('express');
const dao = require('../../common/commonDao');
const uuid = require('uuid4');
const router = express.Router();


router.get('/', function(req, res, next) {
	res.render('repository/repository.html');
});

router.get('/history', function(req, res, next) {
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
		query +=' 		, DATE_FORMAT(REG_DT, \'%Y-%m-%d\') AS REG_DT';
		query +=' 		, MOD_ID';
		query +=' 		, IFNULL(\'\',DATE_FORMAT(MOD_DT, \'%Y-%m-%d\')) AS MOD_DT';
		query +=' FROM REPOSITORY';
		query +=' WHERE 1=1';
		if(repoNm && repoNm != "") query +=" AND REPO_NM LIKE '%"+ repoNm +"%'";
		if(repoType && repoType != "") query +=" AND REPO_TYPE = '"+repoType+"'";
		query +=' ORDER BY REPO_NO';
	console.log(query);
	dao.getConnection(function(conn) {
		conn.query(query)
			.then((data) => {
				conn.end();
				res.send(data);
			})
			.catch(err => {
				//handle error
				console.log(err);
				conn.end();
			});
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
		query +=' 		, DATE_FORMAT(REG_DT, \'%Y-%m-%d\') AS REG_DT';
		query +=' 		, MOD_ID';
		query +=' 		, IFNULL(\'\',DATE_FORMAT(MOD_DT, \'%Y-%m-%d\')) AS MOD_DT';
		query +=' FROM REPOSITORY_HISTORY';
		query +=' WHERE 1=1';
		if(repoNm && repoNm != "") query +=" AND REPO_NM LIKE '%"+ repoNm +"%'";
		if(repoType && repoType != "") query +=" AND REPO_TYPE = '"+repoType+"'";
		query +=' ORDER BY REPO_NO';
	console.log(query);
	dao.getConnection(function(conn) {
		conn.query(query)
			.then((data) => {
				conn.end();
				res.send(data);
			})
			.catch(err => {
				//handle error
				console.log(err);
				conn.end();
			});
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

	var insert  = "INSERT INTO REPOSITORY (REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID) VALUES ( ?, ?, ?, ?, ?, ? ); ";
	var params = [repoId, repoNm, repoDesc, repoType, repoVolume, regId];

	//console.log(query,params);
	dao.getConnection(function(conn) {
		conn.query(insert,params)
			.then((data) => {
				conn.end();
			})
			.catch(err => {
				//handle error
				console.log(err);
				conn.end();
				res.send({success:false});
			});
	});

	var insert_history  = "INSERT INTO REPOSITORY_HISTORY(REPO_HIS_TYPE, REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT) ";
		insert_history += " SELECT 'insert', REPO_NO, REPO_ID, REPO_NM, REPO_DESC, REPO_TYPE, REPO_VOLUME, REG_ID, REG_DT, MOD_ID, MOD_DT  FROM REPOSITORY WHERE REPO_ID=? AND REPO_NM=?"; 
	var params_history = [repoId, repoNm];

	//console.log(query,params);
	dao.getConnection(function(conn) {
		conn.query(insert_history,params_history)
			.then((data) => {
				conn.end();
				res.send({success:true});
			})
			.catch(err => {
				console.log(err);
				conn.end();
				res.send({success:false});
			});
	});

});

module.exports = router;
