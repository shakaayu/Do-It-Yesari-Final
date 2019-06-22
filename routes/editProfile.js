var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
const path = require('path');


const User = require('../models/user');

// Set The Storage Engine
// const storage = multer.diskStorage({
// destination: function(req, file, cb) {
//  cb(null, 'uploads/')
//  },
// filename: function(req, file, cb){
//     cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init Upload
// var upload = multer({
//   storage: storage,
//   limits:{fileSize: 1000000},
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// });

// // Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// router.post('/edit/:id', upload.single('myProfile'), function(req, res){

router.post('/edit/:id', function(req, res){
	
User.findByIdAndUpdate({_id:req.params.id},{
	firstName: req.body.firstName,
	lastName: req.body.lastName,
	contact: req.body.contact,
	address: req.body.address,
	town: req.body.town,
	myProfile: req.files
	
}, function(err, docs){
			 	if(err) throw err;
				else
				{ 
				   console.log(docs);
				   res.redirect('/');
				 }
			 });
var profile= new Profile(req.body);
	profile.save(function(err, doc){
		if (err) throw err
			res.redirect('/')
	});
console.log('lolllllll');

})


module.exports = router;