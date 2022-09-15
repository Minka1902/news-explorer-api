const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

// ////////////////////////////////////////////////////////////////
// creates a user with the passed
// email, password, and name in the body
// POST /signup
module.exports.createUser = (req, res) => {
  console.log('Create user Function');
  const { email, password, username } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      console.log(`hash: ${hash}`);
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash // adding the hash to the database,
      });
    })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));
  User.create({ email, password, username })
    .then((user) => {
      console.log(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
      } else {
        console.log(err.name);
        res.status(500).send(err);
      }
    });
  console.log(req.body.password);
};

// ////////////////////////////////////////////////////////////////
// checks the email and password passed in the body
// and returns a JWT
// POST /signin
module.exports.login = (req, res, next) => {
  console.log('Login Function');
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      } else {
        res.send({_id: user._id, email: user.email, username: user.username, savedArticles: user.savedArticles});
        return bcrypt.compare(password, user.password);
      }
    })
    .then((matched) => {
      if (!matched) {
        // the hashes didn't match, rejecting the promise
        console.log(`matched: ${matched}`);
        return Promise.reject(new Error('Incorrect password or email'));
      }
      // successful authentication
      return res.send({ message: `Everything good! ${matched}` });
    })
    .catch(next);
};

// ////////////////////////////////////////////////////////////////
// returns information about the logged-in user (email and name)
// GET /users/me
module.exports.getCurrentUser = (req, res) => {
  console.log('Get current user Function');
  User.find()
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err }));
};
