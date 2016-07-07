const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const secret = require('../config').secret;

const jwtOpts = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

const jwtLogin = new JwtStrategy(jwtOpts, function (payload, done){
  User.findOne(payload.sub, function(err, user){
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

const localOpts = {
  usernameField: 'email',
  session: false
};

const localLogin = new LocalStrategy(localOpts, function(email, password, done){
  User.findOne({email: email}, function(err, user){
    if(err){ return done(err); }
    if(!user){ return done(null, false); }
    user.comparePassword(password, function(err, matched){
      if(err){ return done(err); }
      if(!matched){
         return done(null, false);
        } else {
          return done(null, user);
        }
    });

  });
});

// setup passport to use each strategy
passport.use(jwtLogin);
passport.use(localLogin);