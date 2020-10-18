var express = require('express');
var router = express.Router();

const authController = require('../controllers').auth;
const productsController = require('../controllers').products;

// Without Authentication
router.route('/findAllWithLimitAndOffset').get(productsController.findAllWithLimitAndOffset);
router.route('/findAllByProductCategoryIdWithLimitAndOffset/:productCategoryId').get(productsController.findAllByProductCategoryIdWithLimitAndOffset);
router.route('/findAllByProductSubCategoryIdWithLimitAndOffset/:productSubCategoryId').get(productsController.findAllByProductSubCategoryIdWithLimitAndOffset);
router.route('/findAllByProductSubSubCategoryIdWithLimitAndOffset/:productSubSubCategoryId').get(productsController.findAllByProductSubSubCategoryIdWithLimitAndOffset);
router.route('/search/:keyword').get(productsController.search);
router.route('/searchWithRelatedCategories/:keyword').get(productsController.searchWithRelatedCategories);
router.route('/searchBySubCategoryIdWithRelatedCategories/:subCategoryId/:keyword').get(productsController.searchBySubCategoryIdWithRelatedCategories);
router.route('/:id').get(productsController.findById);
router.route('/findByIdWithImageType/:id/:imageType').get(productsController.findByIdWithImageType);
router.route('/').get(productsController.findAll);
router.route('/featured/:value').get(productsController.findAllByIsFeatured);

// With Authentication
router.route('/count/all').get(authController.authorization, productsController.countAll);
router.route('/create').post(authController.authorization, productsController.create);
router.route('/update/:id').put(authController.authorization, productsController.update);
router.route('/updateStatus/:id').put(authController.authorization, productsController.updateStatus);
router.route('/delete/:id').put(authController.authorization, productsController.delete);

module.exports = router;
