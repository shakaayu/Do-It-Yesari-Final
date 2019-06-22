var LocalStrategy   = require('passport-local').Strategy;
var crypto = require('crypto');
var nodemailer = require('nodemailer');


var User = require('../models/user');
var Token = require('../models/token');

var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('local-signup', new LocalStrategy({

            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){

                User.findOne({username: username}, function(err, user) {
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }

                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'Username already exists'));
                    }
                    else {
                         User.findOne({email: req.body.email}, function(err, user) {
                    email = req.body.email;

                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }

                    if (user) {
                        console.log('Email already exists');
                        return done(null, false, req.flash('message', 'Email already exists'));
                    } else {
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param.email;
                        newUser.firstName = req.param.firstName;
                        newUser.lastName = req.param.lastName;

                        console.log('lol'+req.param.firstName);

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                           
                             var token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });
 
                            // Save the verification token
                            token.save(function (err) {
                                if (err) { return err }

                                        rand=Math.floor((Math.random() * 100) + 54);
                                    host=req.get('host');
                                    link="http://"+req.get('host')+"/verify?id="+rand;
                                                                    console.log('token'+req.body.email);
                     
                                // Send the email
                                var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: "doityesari2017@gmail.com",
                                 pass: 'yesarido2017' } });
                                                                    console.log('tokenxvdf');

                                var mailOptions = { from: 'doityesari2017@gmail.com', 
                                to: 'xmastree.1989@gmail.com', 
                                subject: 'Account Verification Token', 
                                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                                    }

                                // text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' 
                                // + req.headers.host + '\/confirmation\/' + token.token };
                                console.log(mailOptions);
                                transporter.sendMail(mailOptions, function (err) {
                                    if (err) { return err; }
                                   console.log('A verification email has been sent to ');
                                });
                            });
                             console.log('User Registration succesful' + newUser._id);    
                            return done(null, newUser);
                            
                        });
                    }
                });
                    }
                });

               



                // find a user in Mongo with provided username
                /*User.findOne({$or : [{ email :  req.body.email, username: username }]}, function(err, user) {
                    email=req.body.email;
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+ email + username);
                        return done(null, false, req.flash('message','User email Already Exists'));
                    } 
                    
                    else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });*/

            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}