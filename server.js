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

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride(function(req,res){
 var method = req.body._method;
 delete req.body._method;
 return method;
}));

app.use(express.static('public'));

var User = db.User;

app.use('/gallery', gallery);

app.set('view engine', 'jade');
app.set('views', './templates');

app.get('/', function (req, res) {
  res.redirect('/gallery');
});

app.listen(8000, function() {
  console.log('Connected');
  db.sequelize.sync();
});