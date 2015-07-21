var express = require('express');

var oauth2 = require(__base + 'libs/auth/oauth2');
var log = require(__base + 'libs/log')(module);
var  router = express.Router();

router.post('/token', oauth2.token);

module.exports = router;
