var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productSubCategoriesController = require('../controllers').productSubCategories;

// Without Authentication
router.route('/').get(productSubCategoriesController.findAll);
router.route('/:id').get(productSubCategoriesController.findById);
router.route('/findAllbyProductCategoryId/:productCategoryId').get(productSubCategoriesController.findAllbyProductCategoryId);

// With Authentication
router.route('/create').post(authController.authorization, productSubCategoriesController.create);
router.route('/update/:id').put(authController.authorization, productSubCategoriesController.update);
router.route('/delete/:id').put(authController.authorization, productSubCategoriesController.delete);
router.route('/search/:value').get(authController.authorization, productSubCategoriesController.search);

module.exports = router;
