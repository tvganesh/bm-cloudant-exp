/* 
 * A Bluemix application using  Cloudant & Node Express
 * Developed by: Tinniam V Ganesh
 * Date: 06 Aug 2014
 * File: userlist.js
 */
var pouchdb = require('pouchdb');

// Create a callback function
var mycallback = function(err,results) {
    console.log("mycallback");
    if(err) throw err;
};
/* GET Phone users page. */
exports.list =  function(req, res) {
	
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
	  
	var docs = db.allDocs(function(err, response) { 
		val = response.total_rows;		
		var details = "";
		j=0;
		for(i=0; i < val; i++) {
						
			
			db.get(response.rows[i].id, function (err,doc){
				 j++;	
			    details= details + JSON.stringify(doc.Title) + " by  " +  JSON.stringify(doc.author) + "\n";
			    // Kludge because of Node.js asynchronous handling. To be fixed - T V Ganesh
			    if(j == val) {
			    	
			    	res.render('userlist', {
			            "userlist" : items
			        });
			    	console.log(details);
			    }		    
			   
		   }); // End db.get
			
		} //End for	
	
     }); // End db.allDocs
	  
  
};

