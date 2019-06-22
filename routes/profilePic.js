var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
const path = require('path');


const User = require('../models/user');

const storage = multer.diskStorage({
destination: function(req, file, cb) {
 cb(null, '../public/uploads/')
 },
filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
var upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('lola', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('lola', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('lola', {
          msg: 'File Uploaded!',
          file: `/uploads/${req.file.filename}`
        });
      }
    }
  });
});
module.exports = router;