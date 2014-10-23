
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var home = require('./routes/home');
var favicon = require('static-favicon');

var passport = require('passport');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
var app = express();

// all environments
app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(cookieParser()); 
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({secret: "This is secret key"}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/', home.begin);
app.get('/signIn', home.signIn);
app.get('/afterSignIn', home.afterSignIn);
app.post('/afterSignUp', home.afterSignUp);
app.get('/signUp', home.signUp);
app.get('/signout', home.signout);
app.post('/submitReview', home.submitReview);
app.get('/reviewSubmission',home.reviewSubmission);
app.post('/editReview',home.editReview);
app.post('/deleteReview',home.deleteReview);
app.post('/getNames',home.getNames);
app.post('/showAllReview',home.showAllReview);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
