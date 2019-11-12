var express = require('express');
var router = express.Router();
var fs = require("fs");

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('download');
var config = require('../config');

const PREVIEW_PATH = config.photo.path.preview;

router.get('/:type/:photo', function(req, res, next) {
  logger.debug(`Download photo: ${req.params.type}, ${req.params.photo}`)

  const file = `${config.photo_path}/${req.params.type}/${req.params.photo}`;
  res.download(file);
})

module.exports = router;
