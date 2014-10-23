var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'vinay',
	    password : 'admin',
	    port	: '3306'
	});
	return connection;
}


function executeData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
			callback(err, result);
			}
		else 
		{	// return err or result
			callback(err, result);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	


function updateData(callback, updateQuery){
	console.log("update query::"+updateQuery);
	var connection=getConnection();
	connection.query(updateQuery, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			callback(err, result);
		}
	});
}

function insertData(callback, insertQuery){
	console.log("update query::"+insertQuery);
	var connection=getConnection();
	connection.query(insertQuery, function(err, result) {
		callback(err, result);
	});
}
exports.executeData=executeData;
exports.updateData=updateData;
exports.insertData=insertData;