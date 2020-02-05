var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productCategoriesController = require('../controllers').productCategories;

router.route('/').get(productCategoriesController.findAll);
router.route('/:id').get(productCategoriesController.findById);
router.route('/create').post(authController.authorization, productCategoriesController.create);
router.route('/update/:id').put(authController.authorization, productCategoriesController.update);
router.route('/delete/:id').put(authController.authorization, productCategoriesController.delete);
router.route('/search/:value').get(authController.authorization, productCategoriesController.search);

module.exports = router;
