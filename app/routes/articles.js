var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require(__base + 'libs/log')(module);

var db = require(__base + 'libs/db/mongoose');
var Article = require(__base + 'app/model/article');
var Images = require(__base + 'app/model/ImageSchema');

router.get('/', function(req, res) {

  Article.find(function (err, articles) {
    if (!err) {
      return res.json(articles);
    } else {
      res.statusCode = 500;

      log.error('Internal error(%d): %s',res.statusCode,err.message);

      return res.json({
        error: 'Server error'
      });
    }
  });
});

router.post('/', function(req, res) {

  var article = new Article({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description
  });

  if (req.body.images !== undefined) {
    try {
      var imagejson = JSON.parse(req.body.images);

      for (var index in imagejson) {
        console.log(article.images.push);
        var obj = { kind: imagejson[index].kind,
          url: imagejson[index].url };
          console.log(obj);
          article.images.push(obj);
        };
      } catch (e) {
        log.error("Error parsing json: " + e);
      }
    }

    console.log(article);

    article.save(function (err) {
      if (!err) {
        log.info("New article created with id: %s", article.id);
        return res.json({
          status: 'OK',
          article:article
        });
      } else {
        if(err.name === 'ValidationError') {
          res.statusCode = 400;
          res.json({
            error: 'Validation error: '+err.message
          });
        } else {
          res.statusCode = 500;
          res.json({
            error: 'Server error'
          });
        }
        log.error('Internal error(%d): %s', res.statusCode, err.message);
      }
    });
  });

  router.get('/:id', function(req, res) {

    Article.findById(req.params.id, function (err, article) {

      if(!article) {
        res.statusCode = 404;

        return res.json({
          error: 'Not found'
        });
      }

      if (!err) {
        return res.json({
          status: 'OK',
          article:article
        });
      } else {
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);

        return res.json({
          error: 'Server error'
        });
      }
    });
  });

  router.put('/:id', function (req, res){
    var articleId = req.params.id;

    Article.findById(articleId, function (err, article) {
      if(!article) {
        res.statusCode = 404;
        log.error('Article with id: %s Not Found', articleId);
        return res.json({
          error: 'Not found'
        });
      }

      article.title = req.body.title;
      article.description = req.body.description;
      article.author = req.body.author;
      article.images = req.body.images;

      article.save(function (err) {
        if (!err) {
          log.info("Article with id: %s updated", article.id);
          return res.json({
            status: 'OK',
            article:article
          });
        } else {
          if(err.name === 'ValidationError') {
            res.statusCode = 400;
            return res.json({
              error: 'Validation error'
            });
          } else {
            res.statusCode = 500;

            return res.json({
              error: 'Server error'
            });
          }
          log.error('Internal error (%d): %s', res.statusCode, err.message);
        }
      });
    });
  });

  module.exports = router;
