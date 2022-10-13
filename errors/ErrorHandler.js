class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const checkError = (err, req, res) => {
  if (err.name == 'CastError') {
    return res.status(400).send({ message: 'Data invalid.' });
  } if (err.name == 'DocumentNotFoundError') {
    return res.status(404).send({ message: 'Article not found.' });
  } if (err.name == 'ForbiddenError') {
    return res.status(403).send({ message: 'Can`t delete article.' });
  }if (err.name == 'ValidationError') {
    return res.status(422).send({ message: 'Validation error.'});
  } else {
    return res.status(500).send({ message: 'An error has occurred on the server.' });
  }
};

const handleError = (err, req, res, next) => {
  checkError(err, req, res, next);
};

module.exports = { handleError, ErrorHandler };
