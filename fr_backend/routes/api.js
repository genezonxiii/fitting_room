var express = require('express');
var router = express.Router();

// database
var db = require('../model/db');

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('API');

const axios = require('axios');
const config = require('../config');

// moment
var moment = require('moment');

router.get('/model/age/:sex/:age', function (req, res) {
  logger.debug(`model: ${req.params.sex}, ${req.params.age}`)

  let query = `SELECT * FROM tb_model where sex = ? order by ABS(age-?) limit 1`;
  
  db.getConnection(function(err, connection) { 
    connection.query(query, [req.params.sex, req.params.age], function(err, rows) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      res.send(rows);
    })
  });
})

router.get('/model/:sex', function (req, res) {
  logger.debug(`model: ${req.params.sex}`)

  let query = `SELECT * FROM tb_model where sex = ?`;
  query = req.params.sex === 'all'?'SELECT * FROM tb_model':query;
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

router.get('/product/list/:kind/:sex', function (req, res) {
  logger.debug(`product: ${req.params.kind}, ${req.params.sex}`)

  let query = `SELECT * FROM tb_product where kind = ? and sex = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [req.params.kind, req.params.sex], function(err, rows) {
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
      if (err) {
          connection.release();
          logger.error(err);
          return;
      }

      if (rows.length > 0) {
        connection.release();
        res.send(rows);
      } else {
        let query_default = `SELECT * FROM tb_product_detail where product_id = ?`;
 
        connection.query(query_default, [0], function(err, rows) {
          connection.release();

          if (err) {
              logger.error(err);
              return;
          }

          res.send(rows);
        })
      }
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
  let order_no = '';
  const { user_id, detail, setting, store } = req.body;
  const { method, model_id, sex, age, sex_hide, age_hide, persona } = setting;
  
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
                throw err;
              });
          }
        });

        // master
        let query = `INSERT INTO tb_sale (user_id, order_no, model_id, method, 
          sex, sex_hide, age, age_hide, persona, store, sale_date) 
          values (?,?,?,?,?,?,?,?,?,?,now())`;
        connection.query(query, [user_id, order_no, model_id, method, sex, 
          sex_hide, age, age_hide, persona, store], function(err, result) {
          if (err) {
            logger.error(err);
            return connection.rollback(function() {
              throw err;
            });
          }

          const sale_id = result.insertId;
          const mResult = result;

          // detail list
          detail.forEach(function(item) {
            let query = `INSERT INTO tb_sale_detail (sale_id, product_id, color, size, qty) values (?, ?, ?, ?, ?)`;
            connection.query(query, [sale_id, item.product_id, item.color, item.size, item.qty], function(err, result) {
              if (err) {
                logger.error(err);
                return connection.rollback(function() {
                  throw err;
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
      
      if(rows.length > 0){
        delete rows[0].email;
        res.send({success: true, result: rows[0]})
      } else {
        res.send({success: false, result: []})
      }
    })
  });
})


router.post('/user', function (req, res) {
  const { mobile, nick_name, email } = req.body;
  logger.debug(mobile, nick_name, email);
  db.getConnection(function(err, connection) {

    // check user exists 
    let query_seq = `SELECT * FROM tb_user WHERE mobile=?`;
    connection.query(query_seq, [mobile], function(err, rows) {
      if (err) { throw err; }

      if (rows.length > 0) {
        res.send({
          success: false, 
          msg: "User Exists"
        });
        return;
      }

      // register new user
      let query = `INSERT INTO tb_user (mobile, nick_name, email) values (?, ?, ?)`;
      connection.query(query, [mobile, nick_name, email], function(err, result) {
        if (err) {
          logger.error(err);
          return;
        }

        res.send({
          success: true, 
          result: {
            id: result.insertId
          }
        });
      })
    })
  })
})

router.post('/selfie', function (req, res) {
  const data = req.body.data;
  const mobile = req.body.mobile;
  logger.debug(`selfie: ${mobile}`);

  const base64Data = data.replace(/^data:image\/jpeg;base64,/, "");

  require("fs").writeFile(`${config.photo_path}/photo/${mobile}.jpg`, base64Data, 'base64', function(err) {
    if (err) {
      logger.error(err);
      res.send(err);
      return;
    }

    res.send({'success': true});
  });
})

router.post('/recognize', async function (req, res) {
  const mobile = req.body.mobile;
  logger.debug(`recognize: ${mobile}`);

  const { data } = await axios.post('https://sbi1.cdri.org.tw/agegender', {"file": `${mobile}.jpg`});
  logger.debug( data );
  res.send(data);
})

function paddingZero(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

router.get('/store/:kind', function (req, res) {
  const { kind } = req.params;
  logger.debug(`store: ${kind}`)

  let query = `SELECT * FROM tb_config where kind = ?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [kind], function(err, rows) {
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
