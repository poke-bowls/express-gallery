// var express = require('express');
// var router = express.Router();
// var bodyParser = require('body-parser');

// var db = require('./../models');

// var User = db.User;
// var Photo = db.Photo;

// //authentication
// var passport = require('passport');
// var session = require('express-session');
// var LocalStrategy = require( 'passport-local').Strategy;
// var CONFIG = require('./../config/session-config');

// // //Add optional secret key to our session
// // router.use(session(CONFIG.SESSION));

// // //Initialize passport project in express
// // router.use(passport.initialize());

// // //set passport session middleware to persist login sessions
// // router.use(passport.session());

// // //in order to maintain persistent login session, the authenticated user must be serialized
// // //to the session. The user will be deserialized when each subsequent request is made.
// // passport.serializeUser(function (user, done){
// //   // user is passed in from Local Strategy
// //   // user is attached to req.user
// //   return done(null, user);
// // });

// // passport.deserializeUser(function (user, done){
// //   return done(null, user);
// // });

// // passport.use(new LocalStrategy(
// //   function (username, password, done) {
// //     var isAuthenticated = authenticate(username, password);
// //     if (!isAuthenticated) {// Not authenticated
// //       return done(null, false); //No error, but credentials dont match
// //     }

// //     var user = {
// //       name: 'test',
// //       role: 'ADMIN',
// //       color: 'green'
// //     };

// //     return done(null, user); //Authenticated
// //   }
// // ));

// router.use(bodyParser.urlencoded({extended: true}));

// router.route('/login')
//   .get(function (req, res){
//     console.log('hi', CONFIG);
//     res.render('users/login');
//   })

//   .post(passport.authenticate('local', {
//     successRedirect : '/',
//     failureRedirect : '/gallery/login'
//  }));

// router.get('/user', function (req, res){
//   User.findAll()
//     .then(function(users){
//       res.render('users/index', {
//         "Users" : users
//       });
//     });
// });

// router.post('/users', function (req, res) {
//   User.create({
//     username: req.body.username,
//     password: req.body.password
//   })
//     .then(function (user) {
//       res.redirect('/gallery/user');
//     });
// });

// router.route('/')
//   .get(function (req, res){
//     Photo.findAll()
//       .then(function(photos){
//         res.render('photos/index', {
//           "Photos" : photos
//         });
//       });
//   })
//   .post(function (req, res) {
//     User.find({
//       where : {
//         username : req.body.author
//       }
//     })
//     .then(function(data){
//       if(data.dataValues.id !== undefined){
//         Photo.create({ author: req.body.author,
//           link : req.body.link,
//           description : req.body.description,
//           UserId : data.dataValues.id })
//           .then(function (gallery) {
//             res.redirect('/gallery');
//           });
//       } else {
//         throw new Error('Invalid author');
//       }
//     })
//     .catch(function(err){
//       res.send( {'success' : false});
//     });
// })
// .put(function (req, res){
//   Photo.findAll()
//     .then(function(photos){
//       res.render('photos/index', {
//         "Photos" : photos
//       });
//     });
// });

// router.get('/new', function (req, res){
//   res.render('photos/new', {
//     "Photos" : req.body
//   });
// });

// router.route('/:id')
// .get(function (req, res){
//   Photo.find({
//     where : {
//       id : req.params.id
//     }
//   })
//   .then(function(data){
//     Photo.findAll({
//       where : {
//         id : {
//           $ne : req.params.id
//         }
//       }
//     })
//       .then(function(photos){
//           res.render('photos/show', {
//             "otherPhotos" : photos.slice( 0, 5),
//             "photo" : data.dataValues
//           });
//       })
//       .catch(function(err){
//         console.log(err);
//       });
//   })
//   .catch(function(err){
//     res.send({'success' : false});
//   });
// })
// .put(function (req, res){
//   Photo.find({
//     where : {
//       id : req.params.id
//     }
//   })
//   .then(function(data){
//       data.update({
//         link : req.body.link,
//         description : req.body.description });
//       res.redirect('/gallery');
//   })
//   .catch(function(err){
//     res.send( {'success' : false});
//   });
// })
// .delete(function (req, res){
//   Photo.destroy({
//     where : {
//       id : req.params.id
//     }
//   })
//   .then(function(data){
//     res.redirect('/gallery');
//     })
//   .catch(function(err){
//     res.send({"success" : false});
//   });
// });

// router.get('/:id/edit', function (req, res){
//   Photo.find({
//     where : {
//       id : req.params.id
//     }
//   })
//   .then(function(data){
//     res.render( 'photos/edit', {
//       "photo" : data.dataValues
//     });
//   })
//   .catch(function(err){
//     res.send({'success' : false});
//   });
// });


// function authenticate(username, password) {
//   var CREDENTIALS = CONFIG.CREDENTIALS;
//   var USERNAME = CREDENTIALS.USERNAME;
//   var PASSWORD = CREDENTIALS.PASSWORD;

//   return (username === USERNAME && password === PASSWORD);
// }

// function isAuthenticated(req, res, next) {
//   console.log('is authenticated');
//   if (!req.isAuthenticated()) {
//     return res.send('error');
//   }
//   return next();
// }

// module.exports = router;