var express = require('express');
var router = express.Router();

const authController = require('../controllers').auth;
const productsController = require('../controllers').products;

// For website frontend
router.route('/findAllWithLimitOffsetAndFileName/:limit/:offset').get(productsController.findAllWithLimitOffsetAndFileName);
router.route('/findAllByProductCategoryIdWithLimitOffsetAndFileName/:productCategoryId/:limit/:offset').get(productsController.findAllByProductCategoryIdWithLimitOffsetAndFileName);
router.route('/findAllbyProductSubCategoryIdWithLimitOffsetAndFileName/:productCategoryId/:limit/:offset').get(productsController.findAllbyProductSubCategoryIdWithLimitOffsetAndFileName);
router.route('/:id').get(productsController.findById);

// For dashboard frontend
router.route('/').get(productsController.findAll);
router.route('/search/:value').get(productsController.search);
router.route('/create').post(authController.authorization, productsController.create);
router.route('/update/:id').put(authController.authorization, productsController.update);
router.route('/delete/:id').put(authController.authorization, productsController.delete);

module.exports = router;
