var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const productVariationsController = require('../controllers').productVariations;

// Without Authentication
router.route('/').get(productVariationsController.findAll);
router.route('/:id').get(productVariationsController.findById);

// With Authentication
router.route('/create').post(authController.authorization, productVariationsController.create);
router.route('/update/:id').put(authController.authorization, productVariationsController.update);
router.route('/delete/:id').put(authController.authorization, productVariationsController.delete);

module.exports = router;
