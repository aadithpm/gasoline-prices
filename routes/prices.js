var express = require('express');
var router = express.Router();
var gasoline_service = require('../services/gasoline');

/* GET home page. */
router.get('/', function(req, res, next) {
  gasoline_service.getPrices().then((results) => {
    res.status(200).send(results);
  });
});

module.exports = router;
