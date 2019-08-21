var express = require('express');
var router = express.Router();

// database
var db = require('../model/db');

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('MAPI');

// moment
var moment = require('moment');

router.get('/order', function (req, res) {
  logger.debug(`order`)

  let query = `SELECT * FROM tb_sale 
    left join tb_user on tb_user.id = tb_sale.user_id
    where process = 0 order by sale_id`;
  db.getConnection(function(err, connection) { 
    connection.query(query, function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

router.post('/order/process', function (req, res) {
  let sale_id = req.body.sale_id;
  logger.debug(`Order Processed: ${sale_id}`);

  let query = `UPDATE tb_sale SET process = 1 where sale_id = ? and process = 0`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sale_id], function(err, result) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(result);
    })
  });
})

router.get('/detail/:sale_id', function (req, res) {
  let sale_id = req.params.sale_id;
  logger.debug(`Order Detail: ${sale_id}`);

  let query = `SELECT * FROM tb_sale_detail 
    left join tb_product on tb_product.product_id = tb_sale_detail.product_id
    where sale_id = ? order by sale_detail_id`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sale_id], function(err, rows) {
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
