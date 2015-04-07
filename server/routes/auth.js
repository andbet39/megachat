/**
 * Created by andrea.terzani on 07/04/2015.
 */
module.exports = function(app) {

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var mongoose = require('mongoose');

    var user = require('../model/userModel.js');
    var User = mongoose.model('User');

    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);

    console.log('1');
    app.use(session({
        store: new MongoStore({
            url: 'mongodb://176.31.162.150:30999/chat'
         }),
        secret: 'sdfasdsfdasfd',
        resave:true,
        saveUninitialized:true
    }));
    console.log('2');

    app.use(passport.initialize());

    app.use(passport.session());




    console.log('3');
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

   function isAuthenticated(req,res,next){
        if(req.isAuthenticated())return next();

        res.redirect('login.html');
    }

    app.post('/login', passport.authenticate('local'),function(req, res){

        res.json(req.user);
    });

    app.get('/currentuser',isAuthenticated,function(req,res){

           res.json(req.user);

    });

    app.get('/test',function(req,res){

        res.json({'result':'ok'});

    });

    app.post('/api/user',function(req,res){

        var u =  new User();
        u.username = req.body.username;
        u.password = req.body.password;

        u.save(function(err){
            if (err) {
                console.log("error saving new user");
            }else{
                res.json(u);
            }
        });
    });




    passport.use(new LocalStrategy(
        function (username, password, done) {

            User.findOne({username: username}, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (user.password != password) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            });
        }

    ));


};