const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../errors/ErrorHandler');

const { NODE_ENV, JWT_SECRET='dev-secret' } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  console.log(`JWT_SECRET: ${JWT_SECRET}`);
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorHandler(401, 'Authorization Required');
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

  req.user = payload;
  next();
};
