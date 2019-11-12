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

router.get('/order/:store', function (req, res) {
  const { store } = req.params;
  logger.debug(`order: ${store}`);

  let query = `SELECT * FROM tb_sale 
    left join tb_user on tb_user.id = tb_sale.user_id
    where process = 0 
    and store = ?
    order by sale_id desc`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [store], function(err, rows) {
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

  let query = `SELECT tb_model.*, tb_persona.description FROM tb_model 
    INNER JOIN tb_persona ON tb_persona.type = tb_model.persona`;
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
  let { sex, age, photo, persona } = req.body;
  logger.info(`Model Insert: ${sex}, ${age}, ${photo}, ${persona} `);

  let query = `INSERT INTO tb_model (sex, age, photo, persona) VALUES (?,?,?,?)`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, age, photo, persona], function(err, result) {
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
  let { model_id, sex, age, photo, remove, persona } = req.body;
  logger.info(`Model Update: ${model_id}, ${sex}, ${age}, ${photo}, ${persona} `);

  let query = `UPDATE tb_model SET sex=?, age=?, photo=?, persona=? WHERE model_id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, age, photo, persona, model_id], function(err, result) {
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
  let { thumbnail, photo3d } = req.body;
  logger.info(`Product Insert: ${product_id}, ${sex}, ${kind}, ${c_product_id}, ${product_name} `);

  let query = `INSERT INTO tb_product (sex, kind, c_product_id, product_name, brand, style, \`desc\`, photo, thumbnail, photo3d) values (?,?,?,?,?,?,?,?,?,?)`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, kind, c_product_id, product_name, brand, style, desc, photo, thumbnail, photo3d], 
      function(err, result) {
        connection.release();

        if (err) {
            logger.error(err);
            return;
        }

        logger.debug(`Product: new ID is ${ result.insertId }`);
        if (result.affectedRows > 0) {
          movePreviewToFolder(`${kind}`, `${photo}`);
          movePreviewToThumbnail(`${kind}`, `${thumbnail}`);
          movePreviewTo3D(`${kind}`, `${photo3d}`);
          res.send(`{ "result": "新增成功，ID為 [${ result.insertId }]" }`);
        } else {
          res.send('{ "result": "更新失敗" }');
        }
    })
  });
})

router.put('/product/', function (req, res) {
  let { product_id, sex, kind, c_product_id, product_name, brand, style, desc, photo, remove } = req.body;
  let { thumbnail, removeThumbnail, photo3d, removePhoto3d } = req.body;
  logger.info(`Product Update: ${product_id}, ${sex}, ${kind}, ${c_product_id}, ${product_name} `);

  let query = `UPDATE tb_product SET sex=?, kind=?, c_product_id=?, product_name=?, brand=?, style=?, \`desc\`=?, photo=?, thumbnail=?, photo3d=? WHERE product_id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [sex, kind, c_product_id, product_name, brand, style, desc, photo, thumbnail, photo3d, product_id], 
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
          movePreviewToThumbnail(`${kind}`, `${thumbnail}`);
          if (thumbnail != removeThumbnail) {
            removeFileThumbnail(`${kind}`, `${removeThumbnail}`);
          }
          movePreviewTo3D(`${kind}`, `${photo3d}`);
          if (photo3d != removePhoto3d) {
            removeFile3D(`${kind}`, `${removePhoto3d}`);
          }
          res.send(`{ "result": "更新成功" }`);
        } else {
          res.send('{ "result": "更新失敗" }');
        }
    })
  });
})

router.delete('/product/', function (req, res) {
  let { product_id, kind, photo, thumbnail, photo3d } = req.body;
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
        removeFileThumbnail(`${kind}`, `${thumbnail}`);
        removeFile3D(`${kind}`, `${photo3d}`);;
        res.send(`{ "result": "刪除成功" }`);
      } else {
        res.send('{ "result": "刪除失敗" }');
      }
    })
  });
})

// 穿搭圖
movePreviewToFolder = (kind, photo) => {
  // MOVE PREVIEW TO NEW FOLDER
  logger.info(`Move File: ${kind}, ${photo}`);

  if (!photo) return;
  
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

  if (!photo) return;

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

// 3D
movePreviewTo3D = (kind, photo) => {
  // MOVE PREVIEW TO NEW FOLDER
  logger.info(`Move File 3D: ${kind}, ${photo}`);

  if(!photo) return; 
  
  fs.access(`${ PREVIEW_PATH }/${ photo }`, fs.constants.F_OK, (err) => {
    if (!err) {
      logger.info('Preview File EXISTS!!!');
      fs.rename(`${ PREVIEW_PATH }/${ photo }`, `${ MAIN_PATH }/${kind}/3d/${ photo }`, (err)=> {
        if (err) throw err;
        logger.info('MOVE DONE');
      })
    }
  });
}

removeFile3D = (kind, photo) => {
  // REMOVE PHOTO
  logger.info(`Remove File 3D: ${kind}, ${photo}`)

  if(!photo) return; 

  fs.access(`${ MAIN_PATH }/${kind}/3d/${ photo }`, fs.constants.F_OK, (err) => {
    if (!err) {
      logger.info('Remove File EXISTS!!!');
      fs.unlink(`${ MAIN_PATH }/${kind}/3d/${ photo }`, (err)=> {
        if (err) throw err;
        logger.info(`${ MAIN_PATH }/${kind}/3d/${ photo } DONE`);
      })
    }
  });
}

// 展示圖
movePreviewToThumbnail = (kind, photo) => {
  // MOVE PREVIEW TO NEW FOLDER
  logger.info(`Move File Thumbnail: ${kind}, ${photo}`);

  if(!photo) return; 
  
  fs.access(`${ PREVIEW_PATH }/${ photo }`, fs.constants.F_OK, (err) => {
    if (!err) {
      logger.info('Preview File EXISTS!!!');
      fs.rename(`${ PREVIEW_PATH }/${ photo }`, `${ MAIN_PATH }/${kind}/thumbnail/${ photo }`, (err)=> {
        if (err) throw err;
        logger.info('MOVE DONE');
      })
    }
  });
}

removeFileThumbnail = (kind, photo) => {
  // REMOVE PHOTO
  logger.info(`Remove File Thumbnail: ${kind}, ${photo}`)

  if(!photo) return; 

  fs.access(`${ MAIN_PATH }/${kind}/thumbnail/${ photo }`, fs.constants.F_OK, (err) => {
    if (!err) {
      logger.info('Remove File EXISTS!!!');
      fs.unlink(`${ MAIN_PATH }/${kind}/thumbnail/${ photo }`, (err)=> {
        if (err) throw err;
        logger.info(`${ MAIN_PATH }/${kind}/thumbnail/${ photo } DONE`);
      })
    }
  });
}

router.get('/3d', function (req, res) {
  logger.debug(`3D List`);

  let query = `SELECT * FROM tb_3d`;
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

router.post('/3d/', function (req, res) {
  let { photo_name, photo1, photo2, photo3, photo4, photo5, photo6 } = req.body;
  logger.info(`3D Insert: ${photo_name}, ${photo1}, ${photo2}, ${photo3}, ${photo4}, ${photo5}, ${photo6} `);

  let query = `INSERT INTO tb_3d (photo_name, photo1, photo2, photo3, photo4, photo5, photo6) values (?,?,?,?,?,?,?)`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [photo_name, photo1, photo2, photo3, photo4, photo5, photo6], 
      function(err, result) {
        connection.release();

        if (err) {
            logger.error(err);
            return;
        }

        logger.debug(`3D: new ID is ${ result.insertId }`);
        if (result.affectedRows > 0) {
          movePreviewToFolder('3d', `${photo1}`);
          movePreviewToFolder('3d', `${photo2}`);
          movePreviewToFolder('3d', `${photo3}`);
          movePreviewToFolder('3d', `${photo4}`);
          movePreviewToFolder('3d', `${photo5}`);
          movePreviewToFolder('3d', `${photo6}`);
          res.send(`{ "result": "新增成功，ID為 [${ result.insertId }]" }`);
        } else {
          res.send('{ "result": "更新失敗" }');
        }
    })
  });
})

router.put('/3d/', function (req, res) {
  let { photo_id, photo_name, photo1, photo2, photo3, photo4, photo5, photo6 } = req.body;
  let { remove1, remove2, remove3, remove4, remove5, remove6 } = req.body;
  logger.info(`3D Update: ${photo_name}, ${photo_name}, ${photo1}, ${photo2}, ${photo3}, ${photo4}, ${photo5}, ${photo6} `);

  let query = `UPDATE tb_3d SET photo_name=?, photo1=?, photo2=?, photo3=?, photo4=?, photo5=?, photo6=? WHERE id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [ photo_name, photo1, photo2, photo3, photo4, photo5, photo6, photo_id ], 
      function(err, result) {
        connection.release();

        if (err) {
            logger.error(err);
            return;
        }

        logger.debug(`3D: ${ result.affectedRows } record(s) updated`);
        if (result.affectedRows > 0) {
          movePreviewToFolder('3d', `${photo1}`);
          if (photo1 != remove1) {
            removePhoto('3d', `${remove1}`);
          }
          movePreviewToFolder('3d', `${photo2}`);
          if (photo2 != remove2) {
            removePhoto('3d', `${remove2}`);
          }
          movePreviewToFolder('3d', `${photo3}`);
          if (photo3 != remove3) {
            removePhoto('3d', `${remove3}`);
          }
          movePreviewToFolder('3d', `${photo4}`);
          if (photo4 != remove4) {
            removePhoto('3d', `${remove4}`);
          }
          movePreviewToFolder('3d', `${photo5}`);
          if (photo5 != remove5) {
            removePhoto('3d', `${remove5}`);
          }
          movePreviewToFolder('3d', `${photo6}`);
          if (photo6 != remove6) {
            removePhoto('3d', `${remove6}`);
          }
          
          res.send(`{ "result": "更新成功" }`);
        } else {
          res.send('{ "result": "更新失敗" }');
        }
    })
  });
})

router.delete('/3d/', function (req, res) {
  let { id, photo1, photo2, photo3, photo4, photo5, photo6, photo3d } = req.body;
  logger.info(`3D Delete: ${id} `);

  let query = `DELETE FROM tb_3d WHERE id=?`;
  db.getConnection(function(err, connection) { 
    connection.query(query, [id], function(err, result) {
      connection.release();

      if (err) {
          logger.error(err);
          return;
      }

      logger.debug(`3D: ${ result.affectedRows } record(s) updated`);
      if (result.affectedRows > 0) {
        removePhoto('3d', `${photo1}`);
        removePhoto('3d', `${photo2}`);
        removePhoto('3d', `${photo3}`);
        removePhoto('3d', `${photo4}`);
        removePhoto('3d', `${photo5}`);
        removePhoto('3d', `${photo6}`);
        removePhoto('3d', `${photo3d}`);
        res.send(`{ "result": "刪除成功" }`);
      } else {
        res.send('{ "result": "刪除失敗" }');
      }
    })
  });
})

module.exports = router;
