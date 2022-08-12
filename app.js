const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Joi, errors, celebrate } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

// connect to the MongoDB server

mongoose.connect('mongodb://localhost:27017/finalDB');


require('dotenv').config();

// console.log(process.env.NODE_ENV);

// include these before other routes
// app.use(cors());
// app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(requestLogger); // enabling the request logger

app.use('/', require('./routes/users'));
app.use('/', require('./routes/articles'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler
app.use(express.static(path.join(__dirname, 'public')));

// ! last app.use if need to add another one do it above
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});

app.listen(PORT, () => {
  console.log('Linked to server');
});
