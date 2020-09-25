var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const customerBalanceController = require('../controllers').customerBalance;

router.route('/').get(authController.authorization, customerBalanceController.findAll);
router.route('/findAllbyCustomerId/:customerId').get(authController.authorization, customerBalanceController.findAllbyCustomerId);
router.route('/findAllbySalesOrderId/:salesOrderId').get(authController.authorization, customerBalanceController.findAllbySalesOrderId);
router.route('/:id').get(authController.authorization, customerBalanceController.findById);

module.exports = router;
