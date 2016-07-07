const User = require('../models/users');
const secret = require('../config').secret;
const jwt = require('jwt-simple');

function createToken(user){
  var timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp} , secret);
};

exports.signin = function(req, res, next){
  const loggedUser = req.user;
  const token = createToken(loggedUser);
  res.json({token:token});
};

exports.signup = function(req, res, next){

  const newEmail = req.body.email;
  const newPassword = req.body.password;

  if(!newEmail || !newPassword){
    res.status(422).send({error: 'You need to enter an email AND a password!'});
  }

  User.findOne({email: newEmail}, function(err, existingUser){
    if(err){
      return next(err);
    }

    if(existingUser){
      return res.status(422).send({error: 'A user with this email already exists!'});
    }

    const entry = {email: newEmail, password: newPassword};

    const newUser = new User(entry);

    newUser.save(function(err){
      if(err){
        return next(err);
      }

      const token = createToken(newUser);

      res.json({token: token});
    });
  });

};