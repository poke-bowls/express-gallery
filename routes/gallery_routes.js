var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var db = require('./../models');

var User = db.User;
var Photo = db.Photo;

//authentication
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require( 'passport-local').Strategy;
var CONFIG = require('./../config/session-config');

// //Add optional secret key to our session
router.use(session(CONFIG.SESSION));

// //Initialize passport project in express
router.use(passport.initialize());

// //set passport session middleware to persist login sessions
router.use(passport.session());

// //in order to maintain persistent login session, the authenticated user must be serialized
// //to the session. The user will be deserialized when each subsequent request is made.
passport.serializeUser(function (user, done){
//   // user is passed in from Local Strategy
//   // user is attached to req.user
  return done(null, user);
});

passport.deserializeUser(function (user, done){
  return done(null, user);
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    // var isAuthenticated = authenticate(username, password);
    // if (!isAuthenticated) {// Not authenticated
    //   return done(null, false); //No error, but credentials dont match
    // }
    User.find({
      where : {
        username : username
      }
    })
    .then(function(data){
      return done(null, data.dataValues);
    })
    .catch(function(err){
      console.log(err);
    });
  }
));

router.use(bodyParser.urlencoded({extended: true}));

router.route('/login')
  .get(function (req, res){
    req.logout();
    res.render('users/login');
  })

  .post(passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/gallery/login'
 }));

router.get('/user', function (req, res){
  User.findAll()
    .then(function(users){
      res.render('users/index', {
        "Users" : users
      });
    });
});

router.get('/logout', function (req, res){
  req.logout();
  res.redirect('/gallery/login');
});

router.route('/user/new')
  .get(function (req, res){
    res.render('users/register');
  })
  .post(function (req, res) {
    User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(function (user) {
        req.login(user, function(err){
          if(err){
            return res.send(err);
          }
          res.redirect('/gallery/user');
        });

      });
  });

router.route('/')
  .get(isAuthenticated, function (req, res){
    Photo.findAll()
      .then(function(photos){
        res.render('photos/index', {
          "currentUser" : req.user.username,
          "Photos" : photos
        });
      });
  })
  .post(function (req, res) {
    User.find({
      where : {
        username : req.body.author
      }
    })
    .then(function(data){
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
})
.put(function (req, res){
  Photo.findAll()
    .then(function(photos){
      res.render('photos/index', {
        "Photos" : photos
      });
    });
});

router.get('/new', isAuthenticated, function (req, res){
  User.find({
    where : {
      id : req.user.id
    }
  })
  .then(function(data){
    res.render('photos/new', {
      "Photos" : req.body,
      "currentUser" : req.user.username
    });
  });
});

router.route('/:id')
.get(isAuthenticated, function (req, res){
  Photo.find({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
    Photo.findAll({
      where : {
        id : {
          $ne : req.params.id
        }
      }
    })
      .then(function(photos){
          res.render('photos/show', {
            "otherPhotos" : photos.slice( 0, 5),
            "photo" : data.dataValues,
            currentUser: req.user.username
          });
      })
      .catch(function(err){
        console.log(err);
      });
  })
  .catch(function(err){
    res.send({'success' : false});
  });
})
.put(function (req, res){
  Photo.find({
    where : {
      id : req.params.id
    }
  })
  .then(function (data){
    if(req.user.id === data.dataValues.UserId){
      Photo.update(
      {
        updatedAt : 'now()',
        title : req.body.title,
        description : req.body.description,
        link : req.body.link
      }, {
        where : {
          id : req.params.id
        }
      })
      .then(function(){
        res.redirect('/gallery/' + req.params.id);
      });
    } else {
      res.send('not authorized');
    }
  });
})
.delete(isAuthenticated, function (req, res){
  Photo.find({
  where : {
    id : req.params.id
  }
  })
  .then(function (data){
    if(req.user.id === data.dataValues.UserId){
      Photo.destroy(
       {
        where : {
          id : req.params.id
        }
      })
      .then(function(){
        res.redirect('/gallery');
      });
    } else {
      res.send('not authorized');
    }
  });
});

router.get('/:id/edit', isAuthenticated, function (req, res){
  Photo.find({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
    res.render( 'photos/edit', {
      "photo" : data.dataValues
    });
  })
  .catch(function(err){
    res.send({'success' : false});
  });
});

// function authenticate(username, password) {

//   User.find({
//     where : {
//         username : username
//       }
//     })
//     .then(function(data){
//       console.log(data.dataValues.username === username && data.dataValues.password === password);
//       return (data.dataValues.username === username && data.dataValues.password === password);
//     })
//     .catch(function(err){
//       console.log(err);
//     });

//   // var CREDENTIALS = CONFIG.CREDENTIALS;
//   // var USERNAME = CREDENTIALS.USERNAME;
//   // var PASSWORD = CREDENTIALS.PASSWORD;

//   // return (username === USERNAME && password === PASSWORD);
// }

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/gallery/login');
  }
  return next();
}

module.exports = router;



router.put('/:id', isAuthenticated, function(req, res){
  Photo.findById(req.params.id)
    .then(function(data){
      if(req.user.id === data.UserId){
        Photo.update(
        {
          updatedAt : 'now()',
          title : req.body.title,
          description : req.body.description,
          link : req.body.link
        }, {
          where : {
            id : req.params.id
          }
        })
        .then(function(){
          res.redirect('/gallery/' + req.params.id);
        });
      } else {
        res.send('not authorized');
      }
    });
});