var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const salesOrdersController = require('../controllers').salesOrders;

router.route('/').get(authController.authorization, salesOrdersController.findAll);
router.route('/findAllbyCustomerId/:customerId').get(authController.authorization, salesOrdersController.findAllbyCustomerId);
router.route('/findAllbyStatus/:status').get(authController.authorization, salesOrdersController.findAllbyStatus);
router.route('/create').post(authController.authorization, salesOrdersController.create);
router.route('/update/:id').put(authController.authorization, salesOrdersController.update);
router.route('/delete/:id').put(authController.authorization, salesOrdersController.delete);
router.route('/search/:value').get(authController.authorization, salesOrdersController.search);
router.route('/:id').get(authController.authorization, salesOrdersController.findById);

module.exports = router;
