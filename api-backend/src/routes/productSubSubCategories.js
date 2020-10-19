var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productSubSubCategoriesController = require('../controllers').productSubSubCategories;

// Without Authentication
router.route('/').get(productSubSubCategoriesController.findAll);
router.route('/:id').get(productSubSubCategoriesController.findById);
router.route('/findAllbyProductCategoryId/:productCategoryId').get(productSubSubCategoriesController.findAllbyProductCategoryId);
router.route('/findAllbyProductSubCategoryId/:productSubCategoryId').get(productSubSubCategoriesController.findAllbyProductSubCategoryId);
router.route('/findAllbyProductCategoryIdAndProductSubCategoryId/:productCategoryId/:productSubCategoryId').get(productSubSubCategoriesController.findAllbyProductCategoryIdAndProductSubCategoryId);

// With Authentication
router.route('/count/all').get(authController.authorization, productSubSubCategoriesController.countAll);
router.route('/create').post(authController.authorization, productSubSubCategoriesController.create);
router.route('/update/:id').put(authController.authorization, productSubSubCategoriesController.update);
router.route('/delete/:id').put(authController.authorization, productSubSubCategoriesController.delete);


module.exports = router;
