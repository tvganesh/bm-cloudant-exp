/* 
 * A Bluemix application using  Cloudant & Node Express
 * Developed by: Tinniam V Ganesh
 * Date: 06 Aug 2014
 * File: newbook.js
 */

exports.list = function(req, res){
  res.render('newbook', { title: 'Add a book'});
};

