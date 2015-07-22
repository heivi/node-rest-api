var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require(__base + 'libs/log')(module);

var db = require(__base + 'libs/db/mongoose');
var Entry = require(__base + 'app/model/entry');

router.get('/', function(req, res) {

  Entry.find(function (err, entries) {
    if (!err) {
      return res.json(entries);
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

  var entry = new Entry(req.body.entry);

  console.log(article);

  entry.save(function (err) {
    if (!err) {
      log.info("New entry created with id: %s", entry.id);
      return res.json({
        status: 'OK',
        entry: entry
      });
    } else {
      if(err.name === 'ValidationError') {
        res.statusCode = 400;
        res.json({
          status: 'error',
          error: 'Validation error: '+err.message
        });
      } else {
        res.statusCode = 500;
        res.json({
          status: 'error',
          error: 'Server error: '+err.message
        });
      }
      log.error('Internal error (%d): %s', res.statusCode, err.message);
    }
  });
});

router.get('/:id', function(req, res) {

  Entry.findById(req.params.id, function (err, entry) {

    if(!entry) {
      res.statusCode = 404;

      return res.json({
        status: 'error',
        error: 'Not found'
      });
    }

    if (!err) {
      return res.json({
        status: 'OK',
        entry: entry
      });
    } else {
      res.statusCode = 500;
      log.error('Internal error (%d): %s',res.statusCode,err.message);

      return res.json({
        status: 'error',
        error: 'Server error: '+err.message
      });
    }
  });
});

router.put('/:id', function (req, res){
  var entryId = req.params.id;

  Entry.findByIdAndUpdate({ _id: entryId }, { $set: req.body }, function (err, entry) {
    if (!err) {
      log.info("Entry with id: %s updated", entry.id);
      return res.json({
        status: 'OK',
        entry: entry
      });
    } else {
      if(err.name === 'ValidationError') {
        res.statusCode = 400;
        return res.json({
          status: 'error',
          error: 'Validation error: ' + err.message
        });
      } else {
        res.statusCode = 500;
        return res.json({
          status: 'error',
          error: 'Server error: ' + err.message
        });
      }
      log.error('Internal error (%d): %s', res.statusCode, err.message);
    }

  });
});

module.exports = router;
