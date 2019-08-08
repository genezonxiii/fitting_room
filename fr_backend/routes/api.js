var express = require('express');
var router = express.Router();

// database
var db = require('../model/db');

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('photo');

router.get('/model/:sex', function (req, res) {
  logger.debug(`model: ${req.params.sex}`)

  let query = `SELECT * FROM tb_model where sex = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [req.params.sex], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

router.get('/product/:kind', function (req, res) {
  logger.debug(`product: ${req.params.kind}`)

  let query = `SELECT * FROM tb_product where kind = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [req.params.kind], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

router.get('/detail/:product_id', function (req, res) {
  logger.debug(`detail - product id: ${req.params.product_id}`)

  let query = `SELECT * FROM tb_product_detail where product_id = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [req.params.product_id], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

router.get('/size/:product_id/:color', function (req, res) {
  logger.debug(`size - product id: ${req.params.product_id}, color: ${req.params.color}`)

  let query = `SELECT * FROM tb_product_detail where product_id = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [req.params.product_id], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

module.exports = router;
