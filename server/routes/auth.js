/**
 * Created by andrea.terzani on 07/04/2015.
 */
module.exports = function(app) {

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;

    var mongoose = require('mongoose');

    var user = require('../model/userModel.js');
    var User = mongoose.model('User');

    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);

    app.use(session({
        store: new MongoStore({
            url: 'mongodb://176.31.162.150:30999/chat'
         }),
        secret: 'sdfasdsfdasfd',
        resave:true,
        saveUninitialized:true
    }));

    app.use(passport.initialize());

    app.use(passport.session());


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

    passport.use(new FacebookStrategy({
            clientID: '1598215213755624',
            clientSecret: 'c019a55f66e96fbb30d1dc882e64406a',
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {


            User.findOne({'facebook.id' :profile.id}, function(err, user) {
                console.log(user);
                if(err) return done(err);

                if(user) {
                    done(null, user);
                }else{
                    console.log(profile);
                    var u =  new User();
                    u.username = profile.emails[0].value;
                    u.facebook.token = accessToken;
                    u.facebookprofileUrl = profile.profileUrl;
                    u.facebook.email = profile.emails[0].value;
                    u.facebook.id = profile.id;
                    u.facebook.displayName=profile.displayName;


                    u.save(function(err){
                        if (err) {
                            console.log("error saving new user");
                           return done(err);

                        }else{
                            console.log("new user : login done")
                            done(null, user);
                        }
                    });
                }
            });
        }
    ));






    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    function isAuthenticated(req,res,next){
        if(req.isAuthenticated())return next();

        res.redirect('login.html');
    }

    app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));

    app.post('/login', passport.authenticate('local'),function(req, res){
        res.json(req.user);
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res) {
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



};