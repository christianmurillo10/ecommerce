var express = require('express');
var router = express.Router();

const authController = require('../controllers').auth;
const productsController = require('../controllers').products;

router.route('/').get(productsController.findAll);
router.route('/withFileName').get(productsController.findAllWithFileName);
router.route('/:id').get(productsController.findById);
router.route('/search/:value').get(productsController.search);
router.route('/findAllbyProductCategoryId/:productCategoryId').get(productsController.findAllbyProductCategoryId);
router.route('/findAllbyProductSubCategoryId/:productSubCategoryId').get(productsController.findAllbyProductSubCategoryId);
router.route('/create').post(authController.authorization, productsController.create);
router.route('/update/:id').put(authController.authorization, productsController.update);
router.route('/delete/:id').put(authController.authorization, productsController.delete);

module.exports = router;
