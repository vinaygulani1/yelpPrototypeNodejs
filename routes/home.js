var ejs = require("ejs");
var mysql = require('./mysql');

var category;
var ejspage;
var data;
var userDetails=[];


function signIn(req, res) {

	ejs.renderFile('./views/signin.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}

function begin(req, res) {

	ejs.renderFile('./views/home.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}




function afterSignIn(req, res) {
	
	var distinctCat=[];
	var dateTime = "";
	var email = req.param("inputUsername");
	var password = req.param("inputPassword");
	// To fetch user details
	var getUser = "select * from yelp.user_details where email='" + email
			+ "' and pswd='" + password + "'";
	console.log("Query is:" + getUser);
	// To fetch distinct category list
	var getCat = "select distinct(category) from yelp.cat_name_list";
	console.log("Query is:" + getCat);
	// To fetch All category name list
	var getAllCat = "select * from yelp.cat_name_list";
	console.log("Query is:" + getAllCat);
	// To fetch last login time
	var getTime = "select * from yelp.time_stamp where email='"+email+"'";
	console.log("Query is:" + getTime);
		// set dateTime
	 
	if (req.cookies.time=== undefined ) {
		fetchTime(function(time) {
			dateTime = time;
			console.log("This is current : : :"+dateTime);
		});
	  }
		
		console.log("This is current : : :"+dateTime);
		mysql.executeData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				console.log("Query executed:" + getTime);
				if(results.length>0){
			     dateTime=results[0].login_time;
			     console.log("This is from table iner ::::"+dateTime);
				}
			}
		},getTime);
		console.log("This is from table ::::"+dateTime);
	
	// check user already exists

	  console.log("Your email cookie is: " + email); 
	 
	  if (password=== undefined ) {
		  var email = req.cookies.email;
		  var  password= req.cookies.password;
		  var time = req.cookies.time;
		  res.send("<script>{ alert(Already Logged out);}</script>");
		  res.send("<script>{ alert('You are logged out... please login again';}</script>You are logged out..!!Click to <a href='/signin'>Login Again</a>!."); 
		  ejspage ="./views/signIn.ejs"; 
		  } 
	  
	  else { 
		  
		 // res.send("<script>{ if(confirm('You are Already logged in!!'))document.location='/';}</script>You are Already logged in..!!Click to <a href='/'>Go HOME</a>!."); 
		  ejspage = "./views/details.ejs"; 
		  }

	  
	// retrieve
	var getAllCategory = function(err, results) {

		if (err) {
			console.log("sorry");
			throw err;
		} else {
			console.log("Query executed:" + getAllCat);
			if (true) {
				
				var reviews=[];
				userDetails[0].time=dateTime;
				ejs.renderFile(ejspage, {
					"cat" : category,
					"allCat" : results,
					"userDetails" : userDetails,
					"time" : dateTime,
					"reviews":reviews,
					"distinctCat":distinctCat
				}, function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			} else {
				ejs.renderFile('./views/logout.ejs', function(err, result) {
					// render
					// on
					// success
					if (!err) {
						res.end(result);
					}
					// render
					// or
					// error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		}

	}
	var getcategoryList = function(err, results) {
		if (err) {
			console.log("sorry");
			throw err;
		} else {
			distinctCat=results;
			console.log("Query executed:" + getCat);
			if (results.length > 0) {
				console.log(results[0]);
				category = results;


				mysql.executeData(getAllCategory, getAllCat);

			} else {
				console.log("No data in cat_name_list table");
			}

		}
	}
	
	var validateUser = function(err, results) {
		if (err) {
			throw err;
		} else {
			console.log("Query executed:" + getUser);
			if (results.length > 0) {
				userDetails = results;
				console.log(results);
				console.log("valid Login");
				res.cookie('fname', results[0].fname);
				res.cookie('lname',results[0].lname);
				res.cookie('email', results[0].email);
				res.cookie('password', results[0].pswd);
				res.cookie('time', dateTime);
				console.log('cookies created successfully');
				
				// console.log(home.results);

				mysql.executeData(getcategoryList, getCat);
			}

			else {

				console.log("Invalid Login");
				ejs.renderFile('./views/loginFail.ejs', function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		}
	}

	mysql.executeData(validateUser, getUser);


}

function signUp(req, res) {
	console.log('Hello');
	var reviews=[];
	ejs.renderFile('./views/signup.ejs',{"reviews":reviews} , function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});

}

function afterSignUp(req, res) {

	
	var insertQuery = "insert into yelp.user_details values('"
		+ req.param("fname") + "','" + req.param("lname") + "'," + "'"
		+ req.param("email") + "'," + "'" + req.param("pswd") + "')";
		console.log("Query is:" + insertQuery);

	
	var getCategoryCallback= function(err, results) {
		if (err) {
			console.log("sorry");
			throw err;
		} else {
			var user = {
				"fname" : req.param("fname"),
				"lname" : req.param("lname"),
				"email" : req.param("email"),
				"pswd" : req.param("pswd"),
				"time" : "$$$$$$$ First Time  Login $$$$$$$"
			}
			console.log(user);

			userDetails[0] = user;
			res.cookie('fname', user.fname);
			res.cookie('lname',user.lname);
			res.cookie('email', user.email);
			res.cookie('password', user.pswd);
			res.cookie('time', user.time);
			
			if (results.length > 0) {
				console.log(results[0]);

				ejs.renderFile('./views/details.ejs', {
					"cat" : results,
					"userDetails" : userDetails
				}, function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}

			else {
				console.log("No data in cat_name_list table");
			}
		}
	}


	var insertCallback=function(err, rows) {
		if (err) {
			res.send(err.message);
			throw err;

		} else {
			console.log('Signup Successful Data inserted in database');
			var getCat = "select distinct(category) from yelp.cat_name_list";
			console.log("Query is:" + getCat);

			mysql.executeData(getCategoryCallback, getCat);

		}
	}

	mysql.executeData(insertCallback, insertQuery);

}

function signout(req, res) {

	  var  password= req.cookies.password;

/*	  if (password) {
		  
		  res.send("<script>{ alert('You are not logged out... please logout to go back';}</script>You are logged out..!!Click to <a href='/afterSignIn'>Home Page</a>!."); 
		  ejspage ="./views/signIn.ejs"; 
		  } */
	  
	var dateTime="";
	fetchTime(function(time){
		dateTime=time;
			});
	console.log(req.cookies);
	var email=req.cookies.email;
	console.log(req.cookies);
	var updateTime= "update  yelp.time_stamp set login_time = '"+dateTime+"' where email ='"+email+"'";
	console.log("Query is:" + updateTime);
	var insertTime="insert into yelp.time_stamp values('"+email+"','"+dateTime+"')";
	console.log("Query is:" + insertTime);

	mysql.insertData(function(err,results){
		if(err){
			mysql.insertData(function(err,results){
				
				if(err){
				
					throw err;
				}
				else 
				{
				 console.log("Query executed:" + updateTime);
				 console.log("Error in updating");
				}
			},updateTime);
		}
		else 
		{
			 console.log("Query executed:" + insertTime);
			 console.log("Results "+results)
		}
	},insertTime);
	
	
			ejs.renderFile('./views/signout.ejs', function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
			
			res.clearCookie('fname');
			res.clearCookie('lname');
			res.clearCookie('email');
			res.clearCookie('password');
			res.clearCookie('time');	
	}
	
	


// Fetch All category and render
var allCatReturn = function(err, results) {

	if (err) {
		console.log("sorry");
		throw err;
	} else {
		if (true) {
			ejs.renderFile('./views/details.ejs', {
				"cat" : category,
				"userDetails" : userDetails,
				"allCat" : results
			}, renderTest);
		} else {
			ejs.renderFile('./views/logout.ejs', function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	}

}


// Fetch distinct category
var catReturn = function(err, results) {
	if (err) {
		console.log("sorry");
		throw err;
	} else {
		if (results.length > 0) {
			console.log(results[0]);
			category = results;
			var getAllCat = "select * from yelp.cat_name_list";
			console.log("Query is:" + getAllCat);

			mysql.executeData(allCatReturn, getAllCat);

		} else {
			console.log("No data in cat_name_list table");
		}

	}

}


//fetch Current Time
function fetchTime(callback){
	var currentdate = new Date(); 
	var datetime = "Last login time: " + currentdate.getDate() + "/"
	                + (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();
	console.log(datetime);
	callback(datetime);

}

//Review form filled insert form values to database and show reviews using showreview.ejs
function submitReview(req,res){
	var category=req.param("category");
	var name=req.param("name");
	var rating=req.param("rating");
	var review= req.param("review");
	var fname= req.cookies.fname;
	var lname= req.cookies.lname;
	var password=req.cookies.password;
	var description=req.param("description");
	var submitQuery1= "insert into yelp.cat_name_list values('"+category+"','"+name+"')";
	var submitQuery2= "insert into yelp.user_name_rating_review values('"+name+"',"+rating+",'"+review+"','"+userDetails[0].fname+"','"+userDetails[0].lname+"','"+description+"')";
	var fetchreviews="select * from yelp.user_name_rating_review where fname='"+fname+"' and lname='"+lname+"'";
	
	console.log("Query : "+submitQuery1);
	console.log("Query : "+submitQuery2);
	mysql.updateData(function(err,results){
		if(err){
			throw err;
		}
		else{
			ejs.renderFile('./views/reviewSubmission.ejs',{"userDetails":userDetails, "reviews":results}, function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
			console.log("Update executed successfully");
		}
		
	},submitQuery1);
	
	mysql.updateData(function(err,results){
		if(err){
			throw err;
		}
		else{
			ejs.renderFile('./views/reviewSubmission.ejs',{"userDetails":userDetails, "reviews":results}, function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					console.log(err);
				}
			});
			console.log("Update executed successfully");
		}
		
	},submitQuery2);
	
	
	var showreviews =function(err,results){
		if(err){
			throw err;
		}
		else{
			console.log("your reviews : "+results);
			ejs.renderFile('./views/showreview.ejs',{"userDetails":userDetails, "reviews":results}, function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
		
	}
	
	mysql.updateData(showreviews,fetchreviews);
	
	
}



//on clicking Write Review it will show the review form page
function reviewSubmission(req,res){
	userDetails[0].fname = req.cookies.fname;
	userDetails[0].lname = req.cookies.lname;
	userDetails[0].email = req.cookies.email;
	userDetails[0].pswd = req.cookies.password;
	userDetails[0].time = req.cookies.time;
	ejs.renderFile('./views/reviewSubmission.ejs',{
		"userDetails" : userDetails
	}, function(err, result) {
	// render on success
		if (!err) {
			res.end(result);
		}
	// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}


// On clicking edit review on review page
function editReview(req,res){
	userDetails[0].fname = req.cookies.fname;
	userDetails[0].lname = req.cookies.lname;
	userDetails[0].email = req.cookies.email;
	userDetails[0].pswd = req.cookies.password;
	userDetails[0].time = req.cookies.time;
	
	var name=req.param("name");
	var description=req.param("description");
	var rating=req.param("rating");
	var review= req.param("review");
	
	console.log("Output  "+userDetails[0]);
	var update="update yelp.user_name_rating_review set description='"+description+"', Rating='"+rating+"', Review='"+review+"' where fname='"+userDetails[0].fname+"' and lname='"+userDetails[0].lname+"'and name='"+name+"'";
	var fetchreviews="select * from yelp.user_name_rating_review where fname='"+userDetails[0].fname+"' and lname='"+userDetails[0].lname+"'";
	mysql.updateData(function(err,results){
		if(err){
			throw err;
		}
		else{
			console.log("Update Review executed successfully");
		}
		
	},update);
	
	var showreviews =function(err,results){
		if(err){
			throw err;
		}
		else{
			console.log("your reviews : "+results);
			ejs.renderFile('./views/reviewSubmission.ejs',{"userDetails":userDetails, "reviews":results}, function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
		
	}
	
	mysql.updateData(showreviews,fetchreviews);

}


// on clicking Delete Review on review page 
function deleteReview(req,res){
	userDetails[0].fname = req.cookies.fname;
	userDetails[0].lname = req.cookies.lname;
	userDetails[0].email = req.cookies.email;
	userDetails[0].pswd = req.cookies.password;
	userDetails[0].time = req.cookies.time;
	
	var name=req.param("name");
	var category=req.param("description");
	var rating=req.param("rating");
	var review= req.param("review");
	
	var deletereview="delete from yelp.user_name_rating_review where name='"+name+"' and fname='"+userDetails[0].fname+"' and lname='"+userDetails[0].lname+"'";
	var fetchreviews="select * from yelp.user_name_rating_review where fname='"+userDetails[0].fname+"' and lname='"+userDetails[0].lname+"'";
	mysql.updateData(function(err,results){
		if(err){
			throw err;
		}
		else{
			console.log("Delete Review executed successfully");
		}
		
	},deletereview);
	
	var showreviews =function(err,results){
		if(err){
			throw err;
		}
		else{
			console.log("your reviews : "+results);
			ejs.renderFile('./views/reviewSubmission.ejs',{"userDetails":userDetails, "reviews":results}, function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
		
	}
	
	mysql.updateData(showreviews,fetchreviews);

}


function getNames(req,res){
	userDetails[0].fname = req.cookies.fname;
	userDetails[0].lname = req.cookies.lname;
	userDetails[0].email = req.cookies.email;
	userDetails[0].pswd = req.cookies.password;
	userDetails[0].time = req.cookies.time;
	
	var category=req.param("category");

	// To fetch distinct category list
	var getCatNames = "select * from yelp.cat_name_list where category='"+category+"'";
	console.log("Query is:" + getCatNames);
	


	var getnames=function(err, results) {
		if (err) {
			console.log("sorry");
			throw err;
		} else {
			console.log("Query executed:" + getCatNames);
			if (results.length > 0) {
				console.log(results[0]);
				reviews=[];
				ejs.renderFile('./views/details.ejs', {
					"cat" : results,
					"userDetails" : userDetails,
					"reviews":reviews
				},function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
				

			} else {
				console.log("No data in cat_name_list table");
			}

		}
	}
	
	mysql.executeData(getnames,getCatNames);
}


function showAllReview(req,res){
	userDetails[0].fname = req.cookies.fname;
	userDetails[0].lname = req.cookies.lname;
	userDetails[0].email = req.cookies.email;
	userDetails[0].pswd = req.cookies.password;
	userDetails[0].time = req.cookies.time;
	var name1=req.param("name1");
	var password=req.cookies.password;
	var fetchreviews="select * from yelp.user_name_rating_review where name='"+name1+"'";
	
	console.log("Query : "+fetchreviews);

	
	var showreviews =function(err,results){
		if(err){
			throw err;
		}
		else{
			var cat=[{"name":req.param("name1")}];
			
			console.log("your reviews : "+results);
			ejs.renderFile('./views/details.ejs',{"userDetails":userDetails, "reviews":results, "cat":cat,"category":category}, function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
		
	}
	
	mysql.updateData(showreviews,fetchreviews);

}



exports.begin = begin;
exports.signIn = signIn;
exports.signUp = signUp;
exports.afterSignIn = afterSignIn;
exports.afterSignUp = afterSignUp;
exports.signout = signout;
exports.submitReview = submitReview;
exports.reviewSubmission= reviewSubmission;
exports.editReview= editReview;
exports.deleteReview= deleteReview;
exports.getNames= getNames;
exports.showAllReview= showAllReview;
