var express = require('express');
var router = express.Router();
var gasoline_service = require('../services/gasoline');

require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
