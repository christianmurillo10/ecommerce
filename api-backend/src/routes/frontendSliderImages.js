var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers').auth;
const frontendSliderImagesController = require('../controllers').frontendSliderImages;

router.route('/').get(frontendSliderImagesController.findAll);
router.route('/:id').get(frontendSliderImagesController.findById);
router.route('/viewImage/:fileName').get(frontendSliderImagesController.viewImage);
router.route('/create').post(authController.authorization, upload.single('image'), frontendSliderImagesController.create);
router.route('/update/:id').put(authController.authorization, upload.single('image'), frontendSliderImagesController.update);
router.route('/delete/:id').put(authController.authorization, frontendSliderImagesController.delete);
router.route('/search/:value').get(authController.authorization, frontendSliderImagesController.search);

module.exports = router;
