const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../errors/ErrorHandler');

const { NODE_ENV, JWT_SECRET='dev-secret' } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(`authorization: ${authorization}`); // ! DEL

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorHandler(401, 'Authorization Required - JWT incorrect');
  }

  // const token = authorization;
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next();
  }
  console.log(`payload: ${payload}`); // ! DEL
  req.userId = payload.userId;
  console.log(`req.userId: ${req.userId}`); // ! DEL
  next();
};
