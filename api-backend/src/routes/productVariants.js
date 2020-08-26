var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productVariantsController = require('../controllers').productVariants;

// Without Authentication
router.route('/').get(productVariantsController.findAll);
router.route('/:id').get(productVariantsController.findById);
router.route('/findAllbyProductId/:productId').get(productVariantsController.findAllbyProductId);

// With Authentication
router.route('/create').post(authController.authorization, productVariantsController.create);
router.route('/update/:id').put(authController.authorization, productVariantsController.update);
router.route('/delete/:id').put(authController.authorization, productVariantsController.delete);
router.route('/search/:value').get(authController.authorization, productVariantsController.search);

module.exports = router;
