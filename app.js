var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);


var passport = require('passport');
mongoose.Promise = Promise;

const store = new MongoDBStore({
    uri: 'mongodb://localhost/myapp',
    collection: 'sessions'
});


var multer = require('multer');
var fs = require('fs');
var User = require('./models/user');
const Material = require('./models/material');
const Cart = require('./public/javascripts/Cart');
const Security = require('./public/javascripts/Security');


var flash = require('connect-flash');

var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var editProfile = require('./routes/editProfile');
var profilePic = require('./routes/profilePic');
var materialSave = require('./routes/materialSave');
var confirmation = require('./routes/confirmation');
var lol = require('./routes/lol');
var tagseg = require('./routes/tagseg');
var xhr = require('./routes/xhr');

var users = require('./routes/users');

app.use(flash()); //put this above passport

// mongoose
mongoose.connect('mongodb://localhost/myapp', function(err){
  if(err){
    console.log('Couldn\'t connect. Ensure that mongodb is running on localhost.');
  }
});


// uncomment after placing your favicon in /public
// app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    store: store,
    name: 'NodeStore' + '-' + Security.generateId(),
    genid: (req) => {
        return Security.generateId()
    }
}));

/* PASSPORT */
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport/init');
initPassport(passport);
/*          */

app.use('/editProfile', editProfile);
app.use('/profilePic', profilePic);
app.use('/materialSave', materialSave);
app.use('/lol', lol);
app.post('/confirmation', confirmation);
app.use('/tagseg', tagseg);
app.use('/xhr', xhr);


// app.use('/confirmation', confirmation);


app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index')(passport);
app.use('/', routes);
app.use('/users', users);

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        User.findByIdAndUpdate({_id:req.params.id},{isVerified:'true'},function(err, docs){
            if (err) throw err
            console.log('saved');
      })
       
            
        //res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    }
    else
    {
        console.log("email is not verified");
       // res.end("<h1>Bad Request</h1>");
    }
}
else
{
   // res.end("<h1>Request is from unknown source");
}
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


module.exports = app;

// 'use strict';
// const nodemailer = require('nodemailer');

// // Generate test SMTP service account from ethereal.email
// // Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         service:'Gmail', // true for 465, false for other ports
//         auth: {
//             user: 'doityesari2017@gmail.com', // generated ethereal user
//             pass: 'yesarido2017'  // generated ethereal password
//         }
//     });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: 'doityesari2017@gmail.com', // sender address
//         to: 's.ankita3124@gmail.com', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>' // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// });