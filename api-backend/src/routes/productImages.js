var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers').auth;
const productImagesController = require('../controllers').productImages;

// Without Authentication
router.route('/viewImage/:fileName/:type').get(productImagesController.viewImage);
router.route('/:id').get(productImagesController.findById);
router.route('/findAllbyProductId/:productId').get(productImagesController.findAllbyProductId);
router.route('/findAllbyProductIdAndType/:productId/:type').get(productImagesController.findAllbyProductIdAndType);

// With Authentication
router.route('/').get(authController.authorization, productImagesController.findAll);
router.route('/create').post(authController.authorization, upload.single('image'), productImagesController.create);
router.route('/update/:id').put(authController.authorization, upload.single('image'), productImagesController.update);
router.route('/delete/:id').put(authController.authorization, productImagesController.delete);


module.exports = router;
