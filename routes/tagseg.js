var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
const path = require('path');


const Material = require('../models/material');


router.post('/', function(req, res){
  
var material= new Material(req.body);
  
  material.save(function(err, doc){
    if (err) throw err
      res.redirect('/')
    console.log(doc)
  });

})


module.exports = router;