var express = require('express');
var router = express.Router();

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('photo');

router.get('/:type/:photo', function (req, res) {
  logger.debug(`get photo: ${req.params.type}, ${req.params.photo}`)
  res.sendFile(`D:/fitting_room/${req.params.type}/${req.params.photo}`);
})

module.exports = router;
