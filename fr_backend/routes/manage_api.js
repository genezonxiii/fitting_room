var express = require('express');
var router = express.Router();
var fs = require("fs");

// database
var db = require('../model/db');

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('MAPI');

// moment
var moment = require('moment');

var config = require('../config');
const MAIN_PATH = config.photo_path,
  PREVIEW_PATH = config.photo.path.preview;

router.get('/order', function (req, res) {
  logger.debug(`order`);

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

router.put('/order', function (req, res) {
  let {sale_id} = req.body;
  logger.debug(`Order Processed: ${sale_id}`);

  let query = `UPDATE tb_sale SET process = 1 where sale_id = ? and process = 0`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sale_id], function(err, result) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      logger.debug(`Order: ${ result.affectedRows } record(s) updated`);
      if (result.affectedRows > 0) {
        res.send(`{ "result": "更新成功" }`);
      } else {
        res.send('{ "result": "更新失敗" }');
      }
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

router.get('/model/list', function (req, res) {
  logger.debug(`Model List`);

  let query = `SELECT * FROM tb_model`;
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

router.post('/model/', function (req, res) {
  let { sex, age, photo } = req.body;
  logger.info(`Model Insert: ${sex}, ${age}, ${photo} `);

  let query = `INSERT INTO tb_model (sex, age, photo) VALUES (?,?,?)`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, age, photo], function(err, result) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      logger.debug(`Model: new ID is ${ result.insertId }`);
      if (result.affectedRows > 0) {
        movePreviewToFolder('model', `${ photo }`);
        res.send(`{ "result": "新增成功，ID為 [${ result.insertId }]" }`);
      } else {
        res.send('{ "result": "新增失敗" }');
      }
    })
  });
})

router.put('/model/', function (req, res) {
  let { model_id, sex, age, photo, remove } = req.body;
  logger.info(`Model Update: ${model_id}, ${sex}, ${age}, ${photo} `);

  let query = `UPDATE tb_model SET sex=?, age=?, photo=? WHERE model_id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, age, photo, model_id], function(err, result) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      logger.debug(`Model: ${ result.affectedRows } record(s) updated`);
      if (result.affectedRows > 0) {
        movePreviewToFolder('model', `${ photo }`);
        // REMOVE PREVIOUS PHOTO
        if (photo != remove) {
          removePhoto('model', `${remove}`);
        }
        
        res.send(`{ "result": "更新成功" }`);
      } else {
        res.send('{ "result": "更新失敗" }');
      }
    })
  });
})

router.delete('/model/', function (req, res) {
  let { model_id, photo } = req.body;
  logger.info(`Model Delete: ${model_id}, ${photo}`);

  let query = `DELETE FROM tb_model WHERE model_id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [model_id], function(err, result) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      logger.debug(`Model: ${ result.affectedRows } record(s) updated`);
      if (result.affectedRows > 0) {
        // REMOVE PHOTO
        removePhoto('model', `${photo}`);

        res.send(`{ "result": "刪除成功" }`);
      } else {
        res.send('{ "result": "刪除失敗" }');
      }
    })
  });
})

router.get('/product/list', function (req, res) {
  logger.debug(`Product List`);

  let query = `SELECT * FROM tb_product`;
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

router.post('/product/', function (req, res) {
  let { product_id, sex, kind, c_product_id, product_name, brand, style, desc, photo } = req.body;
  logger.info(`Product Insert: ${product_id}, ${sex}, ${kind}, ${c_product_id}, ${product_name} `);

  let query = `INSERT INTO tb_product (sex, kind, c_product_id, product_name, brand, style, \`desc\`, photo) values (?,?,?,?,?,?,?,?)`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, kind, c_product_id, product_name, brand, style, desc, photo], 
      function(err, result) {
        connection.release();

        if (err) {
            logger.error(err);
            return;
        }

        logger.debug(`Product: new ID is ${ result.insertId }`);
        if (result.affectedRows > 0) {
          movePreviewToFolder(`${kind}`, `${photo}`);
          res.send(`{ "result": "新增成功，ID為 [${ result.insertId }]" }`);
        } else {
          res.send('{ "result": "更新失敗" }');
        }
    })
  });
})

router.put('/product/', function (req, res) {
  let { product_id, sex, kind, c_product_id, product_name, brand, style, desc, photo, remove } = req.body;
  logger.info(`Product Update: ${product_id}, ${sex}, ${kind}, ${c_product_id}, ${product_name} `);

  let query = `UPDATE tb_product SET sex=?, kind=?, c_product_id=?, product_name=?, brand=?, style=?, \`desc\`=?, photo=? WHERE product_id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, kind, c_product_id, product_name, brand, style, desc, photo, product_id], 
      function(err, result) {
        connection.release();

        if (err) {
            logger.error(err);
            return;
        }

        logger.debug(`Product: ${ result.affectedRows } record(s) updated`);
        if (result.affectedRows > 0) {
          movePreviewToFolder(`${kind}`, `${photo}`);
          if (photo != remove) {
            removePhoto(`${kind}`, `${remove}`);
          }
          res.send(`{ "result": "更新成功" }`);
        } else {
          res.send('{ "result": "更新失敗" }');
        }
    })
  });
})

router.delete('/product/', function (req, res) {
  let { product_id, kind, photo } = req.body;
  logger.info(`Product Delete: ${product_id} `);

  let query = `DELETE FROM tb_product WHERE product_id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [product_id], function(err, result) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      logger.debug(`Product: ${ result.affectedRows } record(s) updated`);
      if (result.affectedRows > 0) {
        removePhoto(`${kind}`, `${photo}`);
        res.send(`{ "result": "刪除成功" }`);
      } else {
        res.send('{ "result": "刪除失敗" }');
      }
    })
  });
})

movePreviewToFolder = (kind, photo) => {
  // MOVE PREVIEW TO NEW FOLDER
  logger.info(`Move File: ${kind}, ${photo}`);
  
  fs.access(`${ PREVIEW_PATH }/${ photo }`, fs.constants.F_OK, (err) => {
    if (!err) {
      logger.info('Preview File EXISTS!!!');
      fs.rename(`${ PREVIEW_PATH }/${ photo }`, `${ MAIN_PATH }/${kind}/${ photo }`, (err)=> {
        if (err) throw err;
        logger.info('MOVE DONE');
      })
    }
  });
}

removePhoto = (kind, photo) => {
  // REMOVE PHOTO
  logger.info(`Remove File: ${kind}, ${photo}`)

  fs.access(`${ MAIN_PATH }/${kind}/${ photo }`, fs.constants.F_OK, (err) => {
    if (!err) {
      logger.info('Remove File EXISTS!!!');
      fs.unlink(`${ MAIN_PATH }/${kind}/${ photo }`, (err)=> {
        if (err) throw err;
        logger.info(`${ MAIN_PATH }/${kind}/${ photo } DONE`);
      })
    }
  });
}

module.exports = router;
