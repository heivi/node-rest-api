var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override');

require(__base + 'libs/auth/auth');

var config = require(__base + 'libs/config');
var log = require(__base + 'libs/log')(module);
var oauth2 = require(__base + 'libs/auth/oauth2');

var api = require(__base + 'app/routes/api');
var users = require(__base + 'app/routes/users');
var entries = require(__base + 'app/routes/entries');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/entries', entries);
app.use('/api/oauth/token', oauth2.token);

// catch 404 and forward to error handler
app.use(function(req, res, next){
  res.status(404);
  log.debug('%s %d %s', req.method, res.statusCode, req.url);
  res.json({
    error: 'Not found'
  });
  return;
});

// error handlers
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  log.error('%s %d %s', req.method, res.statusCode, err.message);
  res.json({
    error: err.message
  });
  return;
});

module.exports = app;
