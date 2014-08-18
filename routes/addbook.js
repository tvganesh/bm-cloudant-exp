 /* 
 * A Bluemix application using  Cloudant & Node Express 
 * Developed by: Tinniam V Ganesh
 * Date: 06 Aug 2014
 * File: addbook.js
 */
var pouchdb = require('pouchdb');
/* POST to Add Book */
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
    var Title = req.body.title;
    var Author = req.body.author;
    
  
    db.put({
		  author: Author,
		  Title : Title,		  
		}, Title, function (err, response) {
		  console.log(err || response);
		  if (err) {
	            // If it failed, return error
	            res.send("There was a problem adding the information to the database.");
	        }
	        else {
	            // Redirect to booklist - Display booklist
	            res.location("booklist");
	            // And forward to success page
	            res.redirect("booklist");
	        }
		});    
};
