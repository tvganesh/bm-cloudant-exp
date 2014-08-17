/* 
 * A Bluemix application using  Cloudant & Node Express
 * Developed by: Tinniam V Ganesh
 * Date: 06 Aug 2014
 * File: updateuser.js
 */
var pouchdb = require('pouchdb');

/* POST to Add User Service */
exports.list = function(req, res) {
	//Parse the process.env for the port and host that we've been assigned
	if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    
		  // Also parse Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	}
	
	var db = new pouchdb('books'),
	 remote =cloudant.url + '/books';
	opts = {
	  continuous: true
	  };
     // Replicate the DB to remote
	console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);
	
    // Get our form values. These rely on the "name" attributes
	    var FirstName = req.body.firstname;
	    var LastName = req.body.lastname;
	    var Mobile = req.body.mobile;
   
	 // Update book3
		db.get('book3', function(err, response) {
			console.log(response);
			return db.put({
			    _id: 'book3',
			    _rev: response._rev,
			    author: response.author,
				Title : 'The da Vinci Code',			  
			 });
			}, function(err, response) {
				 if (err) {
			            // If it failed, return error
			            res.send("There was a problem updating the information to the database.");
			        }
			        else {
			            // If it worked, redirect to display users
			            res.location("userlist");
			            // And forward to success page
			            res.redirect("userlist");
			        }
		});

   
   
};
