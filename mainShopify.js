var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var bodyparser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);
var mysql = require("mysql");
var fs = require("fs");
var bcrypt = require("bcryptjs");


// I wrote this in one night before the deadline, mind the bad comments or naming conventions. I can do more with more time


// put in a seperate file and added to gitignore so you cant read my DB creds
const dbconnectinfo = require('./routes/sql_creds.js');

// setting up the sql connection on my VPS
var sql_connection = mysql.createConnection(dbconnectinfo);

var options = {
    host: dbconnectinfo.host,
    port: 3306,
	user: dbconnectinfo.user,
    password: dbconnectinfo.password,
    database: dbconnectinfo.database,
	createDatabaseTable: true
};



const web_Page_Directory = __dirname + "/www";

// used to parse post data in json formant
app.use(bodyparser.json());
// used to parse get data in url encode format
app.use(bodyparser.urlencoded({ extended: true }));



// Code for webpage portion

app.get('/', function(req, res) {
	res.sendFile('home.html', {root: web_Page_Directory});
	
});



app.get('/test_shopping_cart', function(req, res) {
	res.sendFile('shopping_cart.html', {root: web_Page_Directory});
});





// where the API Begins



app.post('/purchase_cart', function(req, res) {
	
	var parsed = req.body;
	var returnedValues = new Array();
	
	var sql_string = "";
	var sql_vals = [];
	
	// Making a mega sql string with mutiple statements
	for(var x = 0; x < parsed.length; x++){
		console.log(req.body[x]["id"]);
		sql_string = sql_string + 'SELECT * FROM shopify_items WHERE id=?;';  
		sql_vals.push(req.body[x]["id"]);
	} 
	
	
	
	// now we need to check if the ID's from the cart are real and the quantities are good
	sql_connection.query(sql_string, sql_vals, function (err, rows, fields) {
		if (err) throw err;
		
		// check to see if products are in db by their id
		var product_check = true;
		var offending_index = 0;
		
		for(var y = 0; y < rows.length; y++){
			if(rows[y].length == 0){
				offending_index = y;
				product_check = false;
				y = rows.length;
			}
		}
		
		
		// continue if products exist in the db
		if(product_check){

			var total_cost = 0;
			
			var good_quantities = true;
			
			// check if quanities are good
			for(var x = 0; x < rows.length; x++){
				
				
				if(rows[x][0]["inventory_count"] >= req.body[x]["quantity"]){
					
					total_cost += req.body[x]["quantity"]*rows[x][0]["price"];
					
				} else {
					good_quantities = false;
					var JSON_response = {
						ERROR: "Not enough of "+rows[x][0]["title"]
					};
					res.send(JSON.stringify(JSON_response));
					x = rows.length;
				}
				
			} 
			
			// finalize the cart purchase if id's and quantities are good
			if(good_quantities){
				var temp_JSON = {
					status: "Good Purchase!",
					cost: total_cost
				}
			
				// Lower Inventory in DB now
				sql_string = "";
				sql_vals = [];

				// getting the sql statments ready to lower products
				for(var x = 0; x < rows.length; x++){
					sql_string = sql_string + "UPDATE shopify_items SET inventory_count = inventory_count - ? WHERE id=?;";  
					sql_vals.push(req.body[x]["quantity"]);
					sql_vals.push(req.body[x]["id"]);
				} 
				
				// executing the sql and sending the response
				sql_connection.query(sql_string, sql_vals, function (err, rows, fields) {
					if (err) throw err;
					res.send(JSON.stringify(temp_JSON));
				});	
				
			
				
			}
			
		} else {
			// emit error saying id is not in db
			var JSON_response = {
				ERROR: "ID of "+req.body[offending_index]["id"]+" doesnt exist in the database"
			};
			res.send(JSON.stringify(JSON_response));
		}
	});
	



});




app.post('/fetch_all_products',function(req,res){
	var available = req.body.available;
	
	
	if(available == 1){
		// Lib automatically handles SQL Escaping
		// Fetch all with inventory over 0
		sql_connection.query('SELECT * FROM shopify_items WHERE inventory_count>0', null, function (err, rows, fields) {
			if (err) throw err;

			
			if(rows.length > 0){
				res.send(rows);
			}
		});	
	} else {
		// Lib automatically handles SQL Escaping
		// Fetch all products
		sql_connection.query('SELECT * FROM shopify_items', null, function (err, rows, fields) {
			if (err) throw err;
			if(rows.length > 0){
				res.send(rows);
			}
		});	
	}
	
});



app.post('/fetch_product',function(req,res){
	var id = req.body.id;
	
	
	// Lib automatically handles SQL Escaping
	// fetch the product from the db by their unique id
	sql_connection.query('SELECT * FROM shopify_items WHERE id=?', id, function (err, rows, fields) {
		if (err) throw err;
		
		// make sure we get atleast one result
		if(rows.length > 0){
			console.log(rows);
			res.send(rows);
		} else {
			// otherwise we spit out a error
			var JSON_response = {
				ERROR: "Product ID doesn't exist"
			};
			res.send(JSON.stringify(JSON_response));
		}

	});	

});


// start server and listen on port 1111
http.listen(1111, function() {
	console.log('listening on *:1111');
	console.log(__dirname);
});
