var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const shippingMethodsController = require('../controllers').shippingMethods;

router.route('/').get(authController.authorization, shippingMethodsController.findAll);
router.route('/create').post(authController.authorization, shippingMethodsController.create);
router.route('/update/:id').put(authController.authorization, shippingMethodsController.update);
router.route('/delete/:id').put(authController.authorization, shippingMethodsController.delete);
router.route('/:id').get(authController.authorization, shippingMethodsController.findById);

module.exports = router;
