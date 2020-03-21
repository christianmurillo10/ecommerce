var express = require('express');
var router = express.Router();

const authController = require('../controllers').auth;
const productsController = require('../controllers').products;

// Without Authentication
router.route('/findAllWithLimitAndOffset/:limit/:offset').get(productsController.findAllWithLimitAndOffset);
router.route('/findAllWithLimitOffsetAndFileName/:limit/:offset').get(productsController.findAllWithLimitOffsetAndFileName);
router.route('/findAllByProductCategoryIdWithLimitOffsetAndFileName/:productCategoryId/:limit/:offset').get(productsController.findAllByProductCategoryIdWithLimitOffsetAndFileName);
router.route('/findAllByProductSubCategoryIdWithLimitOffsetAndFileName/:productSubCategoryId/:limit/:offset').get(productsController.findAllbyProductSubCategoryIdWithLimitOffsetAndFileName);
router.route('/search/:keyword/:limit/:offset').get(productsController.search);
router.route('/:id').get(productsController.findById);

// With Authentication
router.route('/').get(productsController.findAll);
router.route('/create').post(authController.authorization, productsController.create);
router.route('/update/:id').put(authController.authorization, productsController.update);
router.route('/delete/:id').put(authController.authorization, productsController.delete);

module.exports = router;
