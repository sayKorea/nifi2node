const mariadb = require('mariadb');
const prop = require('./dbproperties.js');

module.exports = function() {
	const pool = mariadb.createPool({
		host: prop.host, 
		port: prop.port,
		user: prop.user, 
		password: prop.password,
		database: prop.database,
		connectionLimit: 10
	});

	return {
		getConnection : function(callback) {
			pool.getConnection()
				.then(conn => {
					callback(conn);
				}).catch(err => {
				//not connected
					throw err;
				});
		},
		end : function(callback){
			pool.end(callback);
		},
		sendJSON : function(response, httpCode, body) {
			var result = JSON.stringify(body);
			response.send(httpCode, result);
		}
	}
}();


// function commondao() {
//     //
//     this.getConnection = function(callback) {
//         pool.getConnection()
//             .then(conn => {
//                 callback(conn);
//             }).catch(err => {
// 			//not connected
// 				throw err;
//         	});
//     };
 
//     //
//     this.getConnectionAsync = async function() {
//         try {
//             let conn = await pool.getConnection();
//             console.log("conn = " + conn); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
//             return conn;
//         } catch (err) {
//             throw err;
//         }
//         return null;
//     };
 
//     //
//     this.sendJSON = function(response, httpCode, body) {
//         var result = JSON.stringify(body);
//         response.send(httpCode, result);
//     };
// }
 
// module.exports = new commondao();