var express = require('express');
var router = express.Router();

var db = require('../model/db');

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('system');

router.get('/', function(req, res, next) {
  logger.debug(`system_config`)

  let query = `SELECT * FROM tb_config where kind = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, ['system'], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
});

module.exports = router;
