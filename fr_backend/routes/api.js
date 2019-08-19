var express = require('express');
var router = express.Router();

// database
var db = require('../model/db');

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('photo');

// moment
var moment = require('moment');

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

router.get('/product/list/:kind', function (req, res) {
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

router.get('/product/:product_id', function (req, res) {
  logger.debug(`product - product id: ${req.params.product_id}`)

  let query = `SELECT * FROM tb_product where product_id = ?`;
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

router.get('/size/:product_id/', function (req, res) {
  const product_id = req.params.product_id,
    size = req.params.size;
  logger.debug(`size - product id: ${product_id}`)
  
  let query = `SELECT * FROM tb_product_detail where product_id = ? group by size order by size`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [product_id, size], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

router.get('/color/:product_id/:size', function (req, res) {
  const product_id = req.params.product_id,
    size = req.params.size;
  logger.debug(`color - product id: ${product_id}, size: ${size}`)
  
  let query = `SELECT * FROM tb_product_detail where product_id = ? and size = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [product_id, size], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

router.post('/order', function (req, res) {
  let user_id = req.body.user_id, 
    order_no = '',
    detail = req.body.detail;
  
  db.getConnection(function(err, connection) { 
    // get seq
    let query_seq = `SELECT * FROM tb_config WHERE kind=? and type=?`;
    connection.query(query_seq, ['order', 'seq'], function(err, rows) {
      if (err) { throw err; }
      let seq = rows[0].value;
      let order_yyyymmdd = moment().format('YYYYMMDD');

      // order no
      order_no = `${order_yyyymmdd}${paddingZero(seq, 4)}`;

      // BEGIN TRANSACTION
      connection.beginTransaction(function(err) {
        if (err) { throw err; }

        let query_update = `UPDATE tb_config SET value = value + 1 WHERE kind = ? AND type = ?`;
        connection.query(query_update, ['order', 'seq'], function(err, result) {
          if (err) {
              logger.error(err);
              return connection.rollback(function() {
                throw error;
              });
          }
        });

        // master
        let query = `INSERT INTO tb_sale (user_id, order_no, sale_date) values (?, ?, now())`;
        connection.query(query, [user_id, order_no], function(err, result) {
          const sale_id = result.insertId;
          const mResult = result;

          if (err) {
              logger.error(err);
              return connection.rollback(function() {
                throw error;
              });
          }

          // detail list
          detail.forEach(function(item) {
            let query = `INSERT INTO tb_sale_detail (sale_id, product_id, color, size, qty) values (?, ?, ?, ?, ?)`;
            connection.query(query, [sale_id, item.product_id, item.color, item.size, item.qty], function(err, result) {
              if (err) {
                  logger.error(err);
                  return connection.rollback(function() {
                    throw error;
                  });
              }
            });
          })

          // COMMIT
          connection.commit(function(err) {
            if (err) {
              return connection.rollback(function() {
                throw err;
              });
            }
            connection.release();
            logger.debug(`Order No: ${order_no}`);

            const resResult = {
              affectedRows: result.affectedRows,
              order_no: order_no
            }

            res.send(resResult);
          });
        })
      });
    })
  });
})

router.get('/user/:mobile', function (req, res) {
  logger.debug(`mobile: ${req.params.mobile}`)

  let query = `SELECT * FROM tb_user where mobile = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [req.params.mobile], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      logger.debug(`Result length: ${rows.length}`);
      let succ = rows.length > 0? true:false;
      delete rows[0].email;
      res.send({success: succ, result: rows[0]});
    })
  });
})

function paddingZero(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = router;
