const Article = require('../models/article');
const { checkError } = require('../errors/ErrorHandler');

module.exports.saveArticle = (req, res) => {
  Article.findByIdAndUpdate(
    req.params.articleId,
    { $addToSet: { savedArticles: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      checkError(err, res, req);
    });
};

module.exports.unsaveArticle = (req, res) => {
  Article.findByIdAndUpdate(
    req.params.articleId,
    { $pull: { savedArticles: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      checkError(err, res, req);
    });
};

module.exports.deleteArticle = (req, res) => {
  Article.findByIdAndRemove(req.params.articleId)
    .orFail()
    .then((article) => {
      if (req.user._id === article.ownerId) {
        res.send({ data: article });
      } else {
        res.status(403).send({ message: 'Error, unable to delete the article!' });
      }
    })
    .catch((err) => {
      checkError(err, res, req);
    });
};

module.exports.createArticle = (req, res) => {
  const { name, keyword, text } = req.body;
  const owner = req.user._id;
  Article.create({
    name, keyword, text, owner,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => {
      checkError(err, res, req);
    });
};

module.exports.getArticles = (req, res) => {
  Article.find({})
    .orFail()
    .then((articles) => res.send({ data: articles }))
    .catch((err) => {
      checkError(err, res, req);
    });
};
