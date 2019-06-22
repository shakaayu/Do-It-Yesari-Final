var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var passport = require('passport');

var multer = require('multer');
var fs = require('fs');


var flash = require('connect-flash');

var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var editProfile = require('./routes/editProfile');
var profilePic = require('./routes/profilePic');
var materialSave = require('./routes/materialSave');

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
    saveUninitialized: false
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


app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index')(passport);
app.use('/', routes);
app.use('/users', users);


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

