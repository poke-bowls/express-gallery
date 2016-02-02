var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./models');
var router = express.Router();
var gallery = require('./routes/gallery_routes.js');
var methodOverride = require('method-override');

//authentication
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require( 'passport-local').Strategy;
var CONFIG = require('./config/session-config');

app.use(bodyParser.urlencoded({extended:true
}));

app.use(methodOverride(function(req,res){
 var method = req.body._method;
 delete req.body._method;
 return method;
}));

app.use(express.static('public'));

var User = db.User;

app.use('/gallery', gallery);

//Add optional secret key to our session
app.use(session(CONFIG.SESSION));

//Initialize passport project in express
app.use(passport.initialize());

//set passport session middleware to persist login sessions
app.use(passport.session());

//in order to maintain persistent login session, the authenticated user must be serialized
//to the session. The user will be deserialized when each subsequent request is made.
passport.serializeUser(function (user, done){
  // user is passed in from Local Strategy
  // user is attached to req.user
  return done(null, user);
});

passport.deserializeUser(function (user, done){
  return done(null, user);
});

passport.use( new LocalStrategy(
  function (username, password, done) {
    var isAuthenticated = authenticate(username, password);
    if (!isAuthenticated) {// Not authenticated
      return done(null, false); //No error, but credentials dont match
    }

    var user = {
      name : 'Bob',
      role : 'ADMIN',
      color : 'green'
    };
    return done(null, user); //Authenticated
  }
));

app.set('view engine', 'jade');
app.set('views', './templates');

app.get('/', function (req, res){
  res.redirect('/gallery');
});

app.listen(3000, function() {
  console.log('Connected');
  db.sequelize.sync();
});