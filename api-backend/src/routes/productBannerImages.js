var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers').auth;
const productBannerImagesController = require('../controllers').productBannerImages;

router.route('/').get(productBannerImagesController.findAll);
router.route('/:id').get(productBannerImagesController.findById);
router.route('/viewImage/:fileName').get(productBannerImagesController.viewImage);
router.route('/create').post(authController.authorization, upload.single('image'), productBannerImagesController.create);
router.route('/update/:id').put(authController.authorization, upload.single('image'), productBannerImagesController.update);
router.route('/delete/:id').put(authController.authorization, productBannerImagesController.delete);
router.route('/search/:value').get(authController.authorization, productBannerImagesController.search);

module.exports = router;
