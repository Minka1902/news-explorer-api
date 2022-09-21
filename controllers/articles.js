const Article = require('../models/article');
const { handleError } = require('../errors/ErrorHandler');

// ////////////////////////////////////////////////////////////////
// get's an article ID and deletes the article
// DELETE /articles/:id
// ! request structure
// ? req.body = {articleId: "article ID"}
module.exports.deleteArticle = (req, res) => {
  Article.findByIdAndRemove(req.params.id)
    .orFail()
    .then((article) => {
      if (req.user._id.toString() === article.owner) {
        res.send({ data: article });
      } else {
        res.status(403).send({ message: 'Error, unable to delete the article!' });
      }
    })
    .catch((err) => {
      handleError(err, req, res);
    });
};

// ////////////////////////////////////////////////////////////////
// get's an article ID and deletes the article
// POST /articles
// ! request structure
// ? req.body={keyword, title, text, date:(DATE), source, link:(URL), image:(URL), owner:(ID)}
module.exports.createArticle = (req, res) => {
  const {
    keyword, title, content, publishedAt, source, link, urlToImage, ownerId,
  } = req.body;

  Article.create({
    keyword, title, content, publishedAt, source, link, urlToImage, ownerId,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => {
      handleError(err, req, res);
    });
};

// ////////////////////////////////////////////////////////////////
// returns all the articles in the DATABASE
// GET /articles
// ! request structure
// ? req.body = {}
module.exports.getArticles = (req, res) => {
  Article.find({})
    .orFail()
    .then((articles) => res.send({ articles }))
    .catch((err) => {
      handleError(err, req, res);
    });
};
