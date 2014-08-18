/* 
 * A Bluemix application using  Cloudant & Node Express
 * Developed by: Tinniam V Ganesh
 * Date: 06 Aug 2014
 * File: updatebook.js
 */
var pouchdb = require('pouchdb');

/* POST to Update book Service */
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
	var DocId = req.body.docid;
	var Title = req.body.title;
    var Author = req.body.author;
   
	 // Update book3
		db.get(DocId, function(err, response) {
			console.log("*******************value=  " + response._id + " " + response._rev + " " + Author + "  " + Title);
			db.put({
			    _id: DocId,
			    _rev: response._rev,
			    author: Author,
				Title : Title,	  
			}, function(err, response) {			
				 if (err) {
			            // If it failed, return error
			            res.send("There was a problem updating the information to the database.");
			        }
			        else {
			            // If it worked, redirect to display books
			            res.location("booklist");
			            // And forward to success page
			            res.redirect("booklist");
			       }
		   });

		});
   
};
