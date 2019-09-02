var express = require('express');
var router = express.Router();

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('photo');

let config = require('../config');

router.get('/:type/:photo', function (req, res) {
  logger.debug(`PHOTO PATH: ${config.photo_path}`)
  logger.debug(`get photo: ${req.params.type}, ${req.params.photo}`)
  res.sendFile(`${config.photo_path}/${req.params.type}/${req.params.photo}`);
})

module.exports = router;
