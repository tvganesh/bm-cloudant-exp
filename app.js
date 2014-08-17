
/**
 * Module dependencies.
 */

 /* 
 * A Bluemix application using  Cloudant & Node Express 
 * Developed by: Tinniam V Ganesh
 * Date: 06 Aug 2014
 * File: app.js
 */

//Set the routes for the CRUD operations
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , userlist = require('./routes/userlist')
  , newuser = require('./routes/newuser')
  , adduser = require('./routes/adduser')
  , changeuser = require('./routes/changeuser')
  , updateuser = require('./routes/updateuser')
  , remuser = require('./routes/remuser')
  , deleteuser = require('./routes/deleteuser')
  , http = require('http')
  , path = require('path');

var pouchdb = require('pouchdb');

var port = (process.env.VCAP_APP_PORT || 1337);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');

var app = express();
app.configure(function(){
app.set('port', port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Invoke the appropriate Express middleware
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/helloworld', routes.index);
app.get('/userlist', userlist.list);
app.get('/newuser', newuser.list);
app.post('/adduser',adduser.list);
app.get('/changeuser', changeuser.list);
app.post('/updateuser', updateuser.list);
app.get('/remuser', remuser.list);
app.post('/deleteuser',deleteuser.list);


if (process.env.VCAP_SERVICES) {
	  // Running on Bluemix. Parse for  the port and host that we've been assigned.
	  var env = JSON.parse(process.env.VCAP_SERVICES);
	  var host = process.env.VCAP_APP_HOST; 
	  var port = process.env.VCAP_APP_PORT;

	  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

	  // Also parse out Cloudant settings.
	  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
}

var port = (process.env.VCAP_APP_PORT || 1337);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');

var db = new pouchdb('books'),
  remote =cloudant.url + '/books';	  
  opts = {
    continuous: true
  };	   
  console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);			
	console.log("Reached3");  


//Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db; // Does not seem to be used
  next();
});

// Create Web server and listen on port 1337
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
 
//Set up the DB connection
	 if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse for  the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  // Also parse out Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	 }
	
	 var db = new pouchdb('books'),
	    remote =cloudant.url + '/books';	  
	    opts = {
	      continuous: true
	    };	   
	    console.log(remote);
		db.replicate.to(remote, opts);
		db.replicate.from(remote, opts);			
		console.log("Reached3");  
		// Put 3 documents into the DB
		db.put({
			  author: 'John Grisham',
			  Title : 'The Firm'		  
			}, 'book1', function (err, response) {
			  console.log(err || response);
			});
		 db.put({
			  author: 'Authur C Clarke',
			  Title : '2001: A Space Odyssey'		  
			}, 'book2', function (err, response) {
			  console.log(err || response);
			});
		 db.put({
			  author: 'Dan Brown',
			  Title : 'Digital Fortress'		  
			}, 'book3', function (err, response) {
			  console.log(err || response);
			});
  	
  }); 
