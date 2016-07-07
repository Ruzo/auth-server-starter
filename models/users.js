const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// declare the model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

// encrypt password before a 'save'
userSchema.pre('save', function(next){
  var user = this;

  bcrypt.hash(user.password, 10, function(err, hash){
    if(err) { return next(err); }

    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(loginPass, callback) {
  bcrypt.compare(loginPass, this.password, function(err, res){
    callback(err, res);
  });
};

// create the model class
const ModelClass = mongoose.model('user', userSchema);

// export the model class
module.exports = ModelClass;