var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const customerCartsController = require('../controllers').customerCarts;

router.route('/').get(authController.authorization, customerCartsController.findAll);
router.route('/findAllbyCustomerId/:customerId').get(authController.authorization, customerCartsController.findAllbyCustomerId);
router.route('/create').post(authController.authorization, customerCartsController.create);
router.route('/update/:id').put(authController.authorization, customerCartsController.update);
router.route('/delete/:id').delete(authController.authorization, customerCartsController.delete);
router.route('/search/:value').get(authController.authorization, customerCartsController.search);
router.route('/:id').get(authController.authorization, customerCartsController.findById);

module.exports = router;
