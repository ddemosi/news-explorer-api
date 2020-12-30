const Article = require('../models/article');
const AuthorizationRequiredError = require('../errors/authorization-required-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const AccessDeniedError = require('../errors/access-denied-error');
const {
  badRequestMessage, authErrorMessage, resourceNotFoundMessage,
} = require('../utils/constants');

function getArticles(req, res, next) {
  if (!req.user._id) {
    throw new AuthorizationRequiredError(authErrorMessage);
  }
  Article.findArticleByUser(req.user._id)
    .then((articles) => {
      if (!articles) {
        throw new BadRequestError(badRequestMessage);
      }
      res.status(200).send(articles);
    })
    .catch(next);
}

function createArticle(req, res, next) {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((result) => {
      if (!result) {
        throw new BadRequestError(badRequestMessage);
      }
      res.status(200).send(result);
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  const id = req.params.articleId;

  Article.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(resourceNotFoundMessage);
      }
      if (String(card.owner) === req.user._id) {
        Article.findByIdAndRemove(id, () => {
          res.status(200).send({ message: 'Article deleted' });
        });
      } else if (req.params.id === undefined) {
        throw new NotFoundError(resourceNotFoundMessage);
      } else {
        throw new AccessDeniedError(authErrorMessage);
      }
    })
    .catch(next);
}

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
