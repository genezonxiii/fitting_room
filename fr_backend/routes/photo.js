var express = require('express');
var router = express.Router();
var fs = require("fs");

// log4js
var log4js = require('../log4js').log4js;
var logger = log4js.getLogger('photo');
var config = require('../config');

const PREVIEW_PATH = config.photo.path.preview;

const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.get('/:type/3d/:photo', function (req, res) {
  logger.debug(`3D: ${req.params.type}, ${req.params.photo}`)
  res.sendFile(`${config.photo_path}/${req.params.type}/3d/${req.params.photo}`);
})

router.get('/:type/thumbnail/:photo', function (req, res) {
  logger.debug(`thumbnail: ${req.params.type}, ${req.params.photo}`)
  res.sendFile(`${config.photo_path}/${req.params.type}/thumbnail/${req.params.photo}`);
})

router.get('/:type/:photo', function (req, res) {
  logger.debug(`photo: ${req.params.type}, ${req.params.photo}`)
  res.sendFile(`${config.photo_path}/${req.params.type}/${req.params.photo}`);
})

router.get('/preview', function(req, res, next) {
	const { kind, name } = req.query;
	let full_path = `${ PREVIEW_PATH }/${ name }`;
	console.log(`Preview: ${name}`);
	
	if (kind == 'model') {
		full_path = `${ PREVIEW_PATH }/${ name }`
		console.log(full_path);
	} 

	if (!fs.existsSync(full_path)) {
	    return res.status(404).send('file not exists');
	}

	res.sendFile(`${ full_path }`);
});


router.post('/preview', function(req, res, next) {
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.photo;

  // if (sampleFile.mimetype !== FILE_TYPE) {
  //   return res.status(415).send('警告: 檔案格式不是 image/jpeg');
  // }

  // if (sampleFile.size > FILE_SIZE_1000) {
  //   return res.status(415).send(`警告: 檔案大小限制是 ${ FILE_SIZE }KB. 您上傳的檔案大小是 ${ sampleFile.size /1000 }KB`);
  // }

  let new_name = exports.gen_file_name(sampleFile.name);
  
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`${ PREVIEW_PATH }/${ new_name }`, function(err) {
    if (err){
      console.log(`Error: ${ err }`);
      return res.status(500).send(err);
    }

    // let verify = exports.verify_image_size("photo", `${ new_name }`);
    // if (!verify.result) {
    //   return res.status(415).send(`警告: 檔案像素限制是 ${ FILE_WIDTH }x${ FILE_HEIGHT }. 您上傳的檔案像素是 ${ verify.dimensions.width }x${ verify.dimensions.height }.`);
    // }

    return res.send(`${ new_name }`);
  });
});

exports.gen_file_name = function(file_name) {
  // get file extension and new file name
  var path = require('path');
  let ext = path.extname(file_name);
  let new_file_name = new Date().getTime();
  return `${ new_file_name }${ ext }`;
}

module.exports = router;
