var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var db = require('./../models');

var User = db.User;
var Photo = db.Photo;

router.use(bodyParser.urlencoded({extended: true}));

router.get('/user', function (req, res){
  User.findAll()
    .then(function(users){
      res.render('users/index', {
        "Users" : users
      });
    });
});

router.post('/users', function (req, res) {
  User.create({ username: req.body.username })
    .then(function (user) {
      res.redirect('/');
    });
});

router.get('/', function (req, res){
  Photo.findAll()
    .then(function(photos){
      res.render('photos/index', {
        "Photos" : photos
      });
    });
});

router.post('/', function (req, res) {
  User.find({
    where : {
      username : req.body.author
    }
  })
  .then(function(data){
    console.log(data.dataValues.id);
    if(data.dataValues.id !== undefined){
      Photo.create({ author: req.body.author,
        link : req.body.link,
        description : req.body.description,
        UserId : data.dataValues.id })
        .then(function (gallery) {
          res.redirect('/gallery');
        });
    } else {
      throw new Error('Invalid author');
    }
  })
  .catch(function(err){
    res.send( {'success' : false});
  });

  // console.log(userId);

});





module.exports = router;