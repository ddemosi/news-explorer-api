const mongoose = require('mongoose');
const validation = require('validator');
const bcrypt = require('bcryptjs');
const ValidationError = require('../errors/validation-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        validation.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    default: '',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ValidationError('Incorrect email or password');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ValidationError('Incorrect email or password');
          }

          return user; // now user is available
        });
    });
};

module.exports = mongoose.model('user', userSchema);
