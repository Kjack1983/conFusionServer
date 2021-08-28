const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

// define diskStorage for multer.
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		// two params 1 error and second the destination folder 
		// where the images are going to be stored
		callback(null, 'public/images');
	},
	// error and file with the original name that has originally uploaded.
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	}
});

const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
		return callback(new Error('You can upload only image files'), false);
	}

	callback(null, true);
}

const upload = multer({
	storage,
	fileFilter: imageFileFilter  
});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/imageUpload')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403; // not supported.
	res.end('Get operation not supported on /imageUpload');
})
.post(
	cors.corsWithOptions,
	authenticate.verifyUser, 
	authenticate.verifyAdmin, 
	upload.single('imageFile'), 
(req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403; // not supported.
	res.end('Put operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403; // not supported.
	res.end('Delete operation not supported on /imageUpload');
})

module.exports = uploadRouter;