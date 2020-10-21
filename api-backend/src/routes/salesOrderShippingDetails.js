var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const salesOrderShippingDetailsController = require('../controllers').salesOrderShippingDetails;

router.route('/').get(authController.authorization, salesOrderShippingDetailsController.findAll);
router.route('/findAllbySalesOrderId/:salesOrderId').get(authController.authorization, salesOrderShippingDetailsController.findAllbySalesOrderId);
router.route('/create').post(authController.authorization, salesOrderShippingDetailsController.create);
router.route('/update/:id').put(authController.authorization, salesOrderShippingDetailsController.update);
router.route('/delete/:id').put(authController.authorization, salesOrderShippingDetailsController.delete);
router.route('/:id').get(authController.authorization, salesOrderShippingDetailsController.findById);

module.exports = router;
