const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const { JWT_SECRET = 'gfg_jwt_secret_key' } = process.env;

// ////////////////////////////////////////////////////////////////
// creates a user with the passed
// email, password, and username in the request body
// POST /signup
module.exports.createUser = (req, res) => {
  console.log('Create user Function');
  const { email, password, username } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        username: username,
        email: email,
        password: hash, // adding the hash to the database
      })
        .then((user) => {
          return res.send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(400).send(err);
          } else {
            return res.status(500).send(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(err);
      } else {
        return res.status(500).send(err);
      }
    });
};

// ////////////////////////////////////////////////////////////////
// checks the email and password passed in the body
// and returns a JWT
// POST /signin
module.exports.login = (req, res, next) => {
  console.log('Login Function');
  const { email, password } = req.body;

  User.findOne({ email }).select('password')
    .then((user) => {
      console.log(`user: ${user}`);
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              // the hashes didn't match, rejecting the promise
              return Promise.reject(new Error('Incorrect password or email'));
            }

            let data = {
              time: Date(),
              userId: user._id,
            }

            const token = jwt.sign(data, JWT_SECRET);
            // successful authentication
            return res.send({user: user, jwt: token});
          })
      }
    })
    .catch(next);
};

// ////////////////////////////////////////////////////////////////
// returns information about the logged-in user (email and name)
// GET /users/me
module.exports.getCurrentUser = (req, res) => {
  console.log('Get current user Function');
  const userId = req.body.user._id;

  User.findById(userId)
    .then((user) => {
      return res.send({ user: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(err);
      }
    });
};