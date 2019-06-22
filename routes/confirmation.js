var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const User = require('../models/user');
const Token = require('../models/token');

router.get('/confirmation/:id', function(req, res, next) {

    var errors = req.validationErrors();
    if(errors) {
        return err;
    }
    
    // Find a matching token
    Token.findOne({ token: req.params.id }, function(err, token) {
        if(!token) {
            res.status(400).send({ msg: 'Token not found.' });
        }
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function(err, user) {
            if(!user) {
                res.status(400).send({ msg: 'User not found.' });
            }
            if(user.isVerified) {
                res.status(400).send({ msg: 'User already verified.' });
            }
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function(err) {
                if(err) {
                    throw err;
                } else { 
                    res.redirect('/');
                    console.log("The account has been verified. Please log in.");
                }
            });
        });
    });
});

module.exports = router;