var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers').auth;
const productBrandsController = require('../controllers').productBrands;

router.route('/viewImage/:fileName').get(productBrandsController.viewImage);
router.route('/:id').get(productBrandsController.findById);
router.route('/').get(authController.authorization, productBrandsController.findAll);
router.route('/create').post(authController.authorization, upload.single('image'), productBrandsController.create);
router.route('/update/:id').put(authController.authorization, upload.single('image'), productBrandsController.update);
router.route('/delete/:id').put(authController.authorization, productBrandsController.delete);
router.route('/search/:value').get(authController.authorization, productBrandsController.search);

module.exports = router;
