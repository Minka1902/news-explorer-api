const Article = require('../models/article');
const { checkError } = require('../errors/ErrorHandler');

// ////////////////////////////////////////////////////////////////
// get's an article ID and deletes the article
// DELETE /articles
// ! request structure
// ? req.body = {articleId: "article ID"}
module.exports.deleteArticle = (req, res) => {
  Article.findByIdAndRemove(req.body.articleId)
    .orFail()
    .then((article) => {
      if (req.user._id === article.owner) {
        res.send({ data: article });
      } else {
        res.status(403).send({ message: 'Error, unable to delete the article!' });
      }
    })
    .catch((err) => {
      checkError(err, res, req);
    });
};

// ////////////////////////////////////////////////////////////////
// get's an article ID and deletes the article
// DELETE /articles
// ! request structure
// ? req.body = { keyword: (STRING), title: (STRING), text: (STRING), date: (DATE), source: (STRING), link: (URL), image: (URL), owner: (ID) }
module.exports.createArticle = (req, res) => {
  const { keyword, title, text, date, source, link, image, owner } = req.body;

  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => {
      checkError(err, res, req);
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
    .then((articles) => res.send({ data: articles }))
    .catch((err) => {
      checkError(err, res, req);
    });
};
