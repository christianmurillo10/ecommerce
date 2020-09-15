var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const salesOrderReturnsController = require('../controllers').salesOrderReturns;

router.route('/').get(authController.authorization, salesOrderReturnsController.findAll);
router.route('/:id').get(authController.authorization, salesOrderReturnsController.findById);
router.route('/findAllbySalesOrderId/:salesOrderId').get(authController.authorization, salesOrderReturnsController.findAllbySalesOrderId);
router.route('/findAllbySalesOrderDetailId/:salesOrderDetailId').get(authController.authorization, salesOrderReturnsController.findAllbySalesOrderDetailId);
router.route('/findAllbySalesOrderIdAndSalesOrderDetailId/:salesOrderId/:salesOrderDetailId').get(authController.authorization, salesOrderReturnsController.findAllbySalesOrderIdAndSalesOrderDetailId);
router.route('/create').post(authController.authorization, salesOrderReturnsController.create);
router.route('/update/:id').put(authController.authorization, salesOrderReturnsController.update);
router.route('/delete/:id').put(authController.authorization, salesOrderReturnsController.delete);
router.route('/search/:value').get(authController.authorization, salesOrderReturnsController.search);

module.exports = router;
