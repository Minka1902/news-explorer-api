const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

// ////////////////////////////////////////////////////////////////
// creates a user with the passed
// email, password, and name in the body
// POST /signup
// ! request structure
// ? req.body = {email: (STRING), password: (STRING), username: (STRING)}
module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // adding the hash to the database
      username: req.body.username,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
      } else {
        if(err.name = "MongoServerError"){
          res.status(409).send(err);
        } else {
          res.status(500).send(err);
        }
      }
    });
};

// ////////////////////////////////////////////////////////////////
// checks the email and password passed in the body
// and returns a JWT
// POST /signin
// ! request structure
// ? req.body = { email: (STRING), password: (STRING) }
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching EMAIL found');
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // the hashes didn't match, rejecting the promise
        return Promise.reject(new Error('Incorrect password or email'));
      }
      // successful authentication
      return res.send({ message: 'Everything good!' });
    })
    .catch((err) => {
      if(err.name == "Unauthorized "){
        res.status(401).send({ message: 'your email or password is incorrect.' })
      }
    });
};

// ////////////////////////////////////////////////////////////////
// returns information about the logged-in user (email and name)
// GET /users/me
// ! request structure
// ? req.body = {id: "user ID"}
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.body.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err }));
};
