var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./models');

var router = express.Router();
var gallery = require('./routes/gallery_routes.js');

var User = db.User;

app.use(bodyParser.urlencoded({extended:true
}));

app.use('/gallery', gallery);

app.set('view engine', 'jade');
app.set('views', './templates');

app.listen(3000, function() {
  console.log('Connected');
  db.sequelize.sync();
});