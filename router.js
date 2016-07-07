const Authorization = require('./controllers/authorization');
const passport = require('passport');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app){
  app.get('/', requireAuth, function(req, res) {
    res.send({success: "Good to go!"});
  });

  app.post('/signup', function(req, res, next){
    Authorization.signup(req, res, next);
  });

  app.post('/signin', requireLogin, function(req, res, next) {
    Authorization.signin(req, res, next);
  });
};