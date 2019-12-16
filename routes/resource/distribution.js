const express = require('express');
const dao = require('../../common/commonDao');
const uuid = require('uuid4');
const router = express.Router();
var request = require('request-promise');

router.get('/', function(req, res, next) {
	res.render('resource/distribution.html');
});

router.get('/his', function(req, res, next) {
	res.render('resource/resource_history.html');
});


router.get('/repo_list', async function(req, res, next) {
	var query = ' SELECT  REPO_NO AS CD';
		query +=' 		, REPO_ID AS CDID';
		query +=' 		, REPO_NM AS CDNM';
		query +=' 		, REPO_DESC AS CDDESC';
		query +=' FROM REPOSITORY';
		query +=' WHERE 1=1';
		query +=' ORDER BY REPO_NO';

	var queryResult = await callDb(query);
	if(queryResult){
		console.log(queryResult);
		res.send(queryResult.rows);
	}else{
		res.send({});
	}
});

router.get('/list', async function(req, res, next) {
	console.log(req.query);
	var distribution = req.query.disbribution;
	var query  =" SELECT  ID                            ";
		query +=" 		, RESOURCE_ID                   ";
		query +=" 		, TITLE                         ";
		query +=" 		, DESCRIPTION                   ";
		query +=" 		, ACCESS_URL                    ";
		query +=" 		, ISSUED                        ";
		query +=" 		, MODIFIED                      ";
		query +=" 		, RIGHTS                        ";
		query +=" 		, FORMAT                        ";
		query +=" 		, BYTE_SIZE                     ";
		query +=" 		, MEDIA_TYPE                    ";
		query +=" 		, DOWNLOAD_URL                  ";
		query +=" 		, SPATIAL_RESOLUTION_IN_METERS  ";
		query +=" 		, TEMPORAL_RESOLUTION           ";
		query +=" 		, CONFORMS_TO                   ";
		query +=" 		, LICENSE                       ";
		query +=" 		, SCHEMA_TYPE                   ";
		query +=" 		, LANDING_PAGE                  ";
		query +=" 		, LANDING_PAGE_URL              ";
		query +=" 		, STORAGE_TYPE                  ";
		query +=" 		, DATA_TYPE                     ";
		query +=" 		, FILE_NAME                     ";
		query +=" 		, EXTRAS                        ";
		query +=" 		, VERSION                       ";
		query +=" 		, VERSION_DESCRIPTION           ";
		query +=" 		, URI                           ";
		query +=" FROM DISTRIBUTION                     ";
		query +=" WHERE 1 = 1                           ";
	console.log(query);

	var queryResult = await callDb(query);
	if(queryResult){
		console.log(queryResult);
		res.send(queryResult.rows);
	}else{
		res.send({});
	}
});

router.post('/save', async function(req, res, next) {
	console.log(req.body);
	var id                                 = req.body.id                          ;
	var title                              = req.body.title                       ;
	var publisher_id                       = req.body.publisher_id                ;
	var owner_id                           = req.body.owner_id                    ;
	var creator_id                         = req.body.creator_id                  ;
	var language                           = req.body.language                    ;
	var landing_page                       = req.body.landing_page                ;
	var description                        = req.body.description                 ;
	var type                               = req.body.type                        ;
	var issued                             = req.body.issued                      ;
	var modified                           = req.body.modified                    ;
	var conforms_to                        = req.body.conforms_to                 ;
	var version                            = req.body.version                     ;
	var version_description                = req.body.version_description         ;
	var landing_page_url                   = req.body.landing_page_url            ;
	var is_free                            = req.body.is_free                     ;
	var is_public                          = req.body.is_public                   ;
	var state                              = req.body.state                       ;
	var image_path                         = req.body.image_path                  ;
	var is_personal                        = req.body.is_personal                 ;
	var approval_state                     = req.body.approval_state              ;
	var extras                             = req.body.extras         			  ;
	var remove_type                        = req.body.remove_type                 ;
	var dq_index                           = req.body.dq_index                    ;
	var measure_date                       = req.body.measure_date                ;
	var spatial_resolution_in_meters       = req.body.spatial_resolution_in_meters;
	var temporal_resolution                = req.body.temporal_resolution         ;
	var spatial_uri                        = req.body.spatial_uri                 ;
	var temporal_start                     = req.body.temporal_start              ;
	var temporal_end                       = req.body.temporal_end                ;
	var accrual_periodicity                = req.body.accrual_periodicity         ;
	var was_generated_by                   = req.body.was_generated_by            ;
	var publisher_spatial_uri              = req.body.publisher_spatial_uri       ;
	var source_type                        = req.body.source_type                 ;
	var endpoint_description               = req.body.endpoint_description        ;
	var endpoint_url                       = req.body.endpoint_url                ;
	var serves_dataset                     = req.body.serves_dataset              ;
	var access_rights                      = req.body.access_rights               ;
	var license                            = req.body.license                     ;
	var method                             = req.body.method                      ;
	var uri                                = req.body.uri                         ; 
	var dataset_uuid                        = req.body.dataset_uuid               ;    
	//var view_cnt                           = req.body.view_cnt  

	//없는 필드 추가
	var is_voucher						= 'Y';
	var view_cnt						= 1000;
	var	is_public						= true;
	var	is_personal						= true;
	//var	extras							={test:1};

	var insert  = " INSERT INTO RESOURCE(ID,TITLE,PUBLISHER_ID,OWNER_ID,CREATOR_ID,LANGUAGE,LANDING_PAGE,DESCRIPTION,TYPE,ISSUED,MODIFIED,CONFORMS_TO,VERSION,VERSION_DESCRIPTION,LANDING_PAGE_URL,IS_FREE,IS_PUBLIC,STATE,IMAGE_PATH,IS_PERSONAL,EXTRAS,REMOVE_TYPE,DQ_INDEX,MEASURE_DATE,SPATIAL_RESOLUTION_IN_METERS,TEMPORAL_RESOLUTION,SPATIAL_URI,TEMPORAL_START,TEMPORAL_END,ACCRUAL_PERIODICITY,WAS_GENERATED_BY,PUBLISHER_SPATIAL_URI,SOURCE_TYPE,ENDPOINT_DESCRIPTION,ENDPOINT_URL,SERVES_DATASET,ACCESS_RIGHTS,LICENSE,METHOD,URI,APPROVAL_STATE,DATASET_UUID)";
		insert += " VALUES ($1 ,$2 ,$3 ,$4 ,$5 ,$6 ,$7 ,$8 ,$9 ,CURRENT_TIMESTAMP ,CURRENT_TIMESTAMP ,$10 ,$11 ,$12 ,$13 ,$14 ,$15 ,$16 ,$17 ,$18 ,$19 ,$20 ,$21 ,CURRENT_TIMESTAMP, $22,$23 ,$24 ,$25 ,$26 ,$27 ,$28 ,$29 ,$30 ,$31 ,$32 ,$33 ,$34 ,$35 ,$36 ,$37 ,$38, $39)";
	var uid = uuid();
	var params = [uid,title,publisher_id,owner_id,creator_id,language,landing_page,description,type,conforms_to,version,version_description,landing_page_url,true,true,state,image_path,is_personal,extras,remove_type,dq_index,spatial_resolution_in_meters,temporal_resolution,spatial_uri,temporal_start,temporal_end,accrual_periodicity,was_generated_by,publisher_spatial_uri,source_type,endpoint_description,endpoint_url,serves_dataset,access_rights,license,method,uri,'request', dataset_uuid];
	
	var queryResult = await callDb(insert, params);
	if(queryResult){
		console.log(queryResult);
		res.send({success:true});
	}else{
		res.send({success:false});
	}
});


router.post('/update', async function(req, res, next) {
	console.log(req.body);
	var id                                 = req.body.m_id                         ; 
	var title                              = req.body.m_title                      ; 
	var publisher_id                       = req.body.m_publisher_id               ; 
	var owner_id                           = req.body.m_owner_id                   ; 
	var creator_id                         = req.body.m_creator_id                 ; 
	var language                           = req.body.m_language                   ; 
	var landing_page                       = req.body.m_landing_page               ; 
	var description                        = req.body.m_description                ; 
	var type                               = req.body.m_type                       ; 
	var issued                             = req.body.m_issued                     ; 
	var modified                           = req.body.m_modified                   ; 
	var conforms_to                        = req.body.m_conforms_to                ; 
	var version                            = req.body.m_version                    ; 
	var version_description                = req.body.m_version_description        ; 
	var landing_page_url                   = req.body.m_landing_page_url           ; 
	var is_free                            = req.body.m_is_free=="free"?true:false ;                     
	var is_public                          = req.body.m_is_public=="public"?true:false; 
	var state                              = req.body.m_state                      ; 
	var image_path                         = req.body.m_image_path                 ; 
	var is_personal                        = req.body.m_is_personal=="personal"?true:false; 
	var approval_state                     = req.body.m_approval_state             ; 
	var extras                             = req.body.m_extras.trim()!=""?JSON.stringify( req.body.m_extras ):'{}'                     ; 
	var remove_type                        = req.body.m_remove_type                ; 
	var dq_index                           = req.body.m_dq_index                   ; 
	var measure_date                       = req.body.m_measure_date               ; 
	var spatial_resolution_in_meters       = req.body.m_spatial_resolution_in_meters;
	var temporal_resolution                = req.body.m_temporal_resolution        ; 
	var spatial_uri                        = req.body.m_spatial_uri                ; 
	var temporal_start                     = req.body.m_temporal_start             ; 
	var temporal_end                       = req.body.m_temporal_end               ; 
	var accrual_periodicity                = req.body.m_accrual_periodicity        ; 
	var was_generated_by                   = req.body.m_was_generated_by           ; 
	var publisher_spatial_uri              = req.body.m_publisher_spatial_uri      ; 
	var source_type                        = req.body.m_source_type                ; 
	var endpoint_description               = req.body.m_endpoint_description       ; 
	var endpoint_url                       = req.body.m_endpoint_url               ; 
	var serves_dataset                     = req.body.m_serves_dataset             ; 
	var access_rights                      = req.body.m_access_rights              ; 
	var license                            = req.body.m_license                    ; 
	var method                             = req.body.m_method                     ; 
	var uri                                = req.body.m_uri                        ;

	var update  = "UPDATE RESOURCE SET                	";
		update += " 	TITLE						  = $1 	,";
		update += " 	PUBLISHER_ID				  = $2 	,";
		update += " 	OWNER_ID					  = $3 	,";
		update += " 	CREATOR_ID					  = $4 	,";
		update += " 	LANGUAGE					  = $5 	,";
		update += " 	LANDING_PAGE				  = $6 	,";
		update += " 	DESCRIPTION					  = $7 	,";
		update += " 	TYPE						  = $8 	,";
		update += " 	MODIFIED					  = CURRENT_TIMESTAMP	,";
		update += " 	CONFORMS_TO					  = $9	,";
		update += " 	VERSION						  = $10	,";
		update += " 	VERSION_DESCRIPTION			  = $11	,";
		update += " 	LANDING_PAGE_URL			  = $12	,";
		update += " 	IS_FREE						  = $13	,";
		update += " 	IS_PUBLIC					  = $14	,";
		update += " 	STATE						  = $15	,";
		update += " 	IMAGE_PATH					  = $16	,";
		update += " 	IS_PERSONAL					  = $17	,";
		update += " 	EXTRAS						  = $18	,";
		update += " 	REMOVE_TYPE					  = $19	,";
		update += " 	DQ_INDEX					  = $20	,";
		update += " 	SPATIAL_RESOLUTION_IN_METERS  = $21	,";
		update += " 	TEMPORAL_RESOLUTION			  = $22	,";
		update += " 	SPATIAL_URI					  = $23	,";
		update += " 	TEMPORAL_START				  = $24	,";
		update += " 	TEMPORAL_END				  = $25	,";
		update += " 	ACCRUAL_PERIODICITY			  = $26	,";
		update += " 	WAS_GENERATED_BY			  = $27	,";
		update += " 	PUBLISHER_SPATIAL_URI		  = $28	,";
		update += " 	SOURCE_TYPE					  = $29	,";
		update += " 	ENDPOINT_DESCRIPTION		  = $30	,";
		update += " 	ENDPOINT_URL				  = $31	,";
		update += " 	SERVES_DATASET				  = $32	,";
		update += " 	ACCESS_RIGHTS				  = $33	,";
		update += " 	LICENSE						  = $34	,";
		update += " 	METHOD						  = $35	,";
		update += " 	URI							  = $36	";
		update += " WHERE ID = $37"
	var params = [title,publisher_id,owner_id,creator_id,language,landing_page,description,type,conforms_to,version,version_description,landing_page_url,is_free,is_public,state,image_path,is_personal,extras,remove_type,dq_index,spatial_resolution_in_meters,temporal_resolution,spatial_uri,temporal_start,temporal_end,accrual_periodicity,was_generated_by,publisher_spatial_uri,source_type,endpoint_description,endpoint_url,serves_dataset,access_rights,license,method,uri, id];
	var queryResult = await callDb(update, params);
	console.log(queryResult);
	if(queryResult){
		console.log(queryResult);
		res.send({success:true});
	}else{
		res.send({success:false});
	}
});

router.post('/delete', async function(req, res, next) {
	console.log(req.body);
	var id = req.body.id; 

	var update  = "DELETE FROM RESOURCE WHERE ID=$1";
	var queryResult = await callDb(update, [id]);

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
