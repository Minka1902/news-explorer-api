class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const checkError = (err, req, res, next) => {
  if (res && err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'NotValid Data' });
    } if (err.name === 'DocumentNotFoundError') {
      res.status(404).send({ message: 'Article not found like' });
    } if (err.name === 'ForbiddenError') {
      res.status(403).send({ message: 'Can`t delete article' });
    } else {
      res.status(500).send({ message: 'An error has occurred on the server' });
    }
  }
  next;
};

const handleError = (err, req, res, next) => {
  checkError(err, req, res, next);
};

module.exports = { handleError };
