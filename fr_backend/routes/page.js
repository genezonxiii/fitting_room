var express = require('express');
var router = express.Router();

var fs = require("fs");
var axios = require('axios');

const config = require('../config');
const fileUpload = require('express-fileupload');

const	FILE_TYPE = config.photo.file.type,
	FILE_SIZE_1000 = config.photo.file.size * 1000, //KB
	FILE_SIZE = config.photo.file.size,
	FILE_WIDTH = config.photo.file.width,
	FILE_HEIGHT = config.photo.file.height;

router.use(fileUpload());

router.get('/test', function(req, res, next) {
  res.render('', { 
    title: '人物', 
    file_type: FILE_TYPE, 
    file_size: FILE_SIZE, 
    file_width: FILE_WIDTH, 
    file_height: FILE_HEIGHT 
  });
});

router.get('/model', function(req, res, next) {
  res.render('model/list', { 
  	title: '人物', 
  	file_type: FILE_TYPE, 
  	file_size: FILE_SIZE, 
  	file_width: FILE_WIDTH, 
  	file_height: FILE_HEIGHT 
  });
});

router.get('/product', function(req, res, next) {
  res.render('product/list', { 
  	title: '衣物', 
  	file_type: FILE_TYPE, 
  	file_size: FILE_SIZE, 
  	file_width: FILE_WIDTH, 
  	file_height: FILE_HEIGHT 
  });
});

module.exports = router;