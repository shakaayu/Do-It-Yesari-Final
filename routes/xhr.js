var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const path = require("path");

const Material = require("../models/material");

router.get("/search", function(req, res, next) {
  var q = req.query.q;
  // var r = "^" + q.toLowerCase();
  Material.find(
    {
      name: {
        $regex: new RegExp(escapeRegex(q), "gi")
      }
    },
    {
      _id: 0,
      _v: 0
    },
    function(err, data) {
      console.log("lol");
      res.json(data);
    }
  ).limit(10);
});
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
router.get("/", function(req, res) {
  if (req.query.search) {
    console.log(req.query.search);
  } else {
    Material.find({}, function(err, allmat) {
      if (err) {
        console.log(err);
      } else {
        res.render("searchList", { products: allmat });
      }
    });
  }
});

module.exports = router;
