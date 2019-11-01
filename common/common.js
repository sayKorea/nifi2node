'use strict';

var log = require("../common/logger.js");

let common={};

common.gfn_caltest = (__p1, __p2)=> __p1+__p2;
common.gfn_caltest1 = (__p1, p2)=>{
	return __p1+__p2;
};
common.gfn_caltest2 = (__p1, ... __p2) =>{
	log.info(__p2.length);
	var y = 0;
	for(let x of __p2){
		y+=x;
		log.info(x);
	}
	return y;
};

module.exports = common;