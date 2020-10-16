var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers').auth;
const productCategoriesController = require('../controllers').productCategories;

// Without Authentication
router.route('/viewImage/:fileName').get(productCategoriesController.viewImage);
router.route('/findAllWithSubCategories').get(productCategoriesController.findAllWithSubCategories);
router.route('/').get(productCategoriesController.findAll);
router.route('/:id').get(productCategoriesController.findById);

// With Authentication
router.route('/count/all').get(authController.authorization, productCategoriesController.countAll);
router.route('/create').post(authController.authorization, upload.fields([{ name: 'icon-image', maxCount: 1 }, { name: 'banner-image', maxCount: 1 }]), productCategoriesController.create);
router.route('/update/:id').put(authController.authorization, upload.fields([{ name: 'icon-image', maxCount: 1 }, { name: 'banner-image', maxCount: 1 }]), productCategoriesController.update);
router.route('/update/featured/:id').put(authController.authorization, productCategoriesController.updateIsFeatured);
router.route('/delete/:id').put(authController.authorization, productCategoriesController.delete);

module.exports = router;
