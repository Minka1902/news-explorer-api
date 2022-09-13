const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

// ////////////////////////////////////////////////////////////////
// creates a user with the passed
// email, password, and name in the body
// POST /signup
module.exports.createUser = (req, res) => {
  console.log("Create user Function");
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
      } else {
        res.status(500).send(err);
      }
    });
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // adding the hash to the database
    }))
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));
};

// ////////////////////////////////////////////////////////////////
// checks the email and password passed in the body
// and returns a JWT
// POST /signin
module.exports.login = (req, res, next) => {
  console.log("Login Function");
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
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
    .catch(next);
};

// ////////////////////////////////////////////////////////////////
// returns information about the logged-in user (email and name)
// GET /users/me
module.exports.getCurrentUser = (req, res) => {
  console.log("Get current user Function");
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err }));
};
