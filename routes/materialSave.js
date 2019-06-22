var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var multer = require("multer");
var fs = require("fs");

const User = require("../models/user");

const Material = require("../models/material");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
});

router.post("/:id", upload.any(), function(req, res) {
  var data = req.body;
  var images = req.files[0];

  var newFile = new Material();
  newFile.name = data.name;

  newFile.price = data.price;
  newFile.quantity = data.quantity;
  newFile.myimage = images.originalname;
  newFile.description = data.description;
  newFile.tags = data.tags;
  newFile.productType = data.productType;

  newFile.postedby = req.params.id;

  newFile.save(function(err, doc) {
    if (err) {
      console.log("error while saving in database");
    }
    /*res.send(req.body);*/
    console.log("newfile", doc._id);
    console.log(req.params.id);

    User.update(
      {
        _id: req.params.id
      },
      {
        $addToSet: { materials: doc._id }
      }
    )
      .populate("materials")
      .exec(function(err) {
        if (!err) {
          console.log("lol");
        }
      });

    // User.find({_id:req.params.id})
    //   .populate('materials')
    //   .exec(function(err) {
    //     if (!err) {
    //       console.log(JSON.stringify(user));
    //     }
    //   });

    // Material.findOne({})
    //         .populate('postedBy')
    //         .exec(function(error, posts) {
    //             console.log(JSON.stringify(posts, null, "\t"))
    // })
    // var filename = newFile._id + images.originalname;
  });

  // Material.create(images, function(error, image) {
  //   if (!error) {
  //   console.log("image created.");
  //   }
  // });

  res.redirect("/");
});

module.exports = router;
