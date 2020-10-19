var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const salesOrderDetailsController = require('../controllers').salesOrderDetails;

router.route('/').get(authController.authorization, salesOrderDetailsController.findAll);
router.route('/findAllbySalesOrderId/:salesOrderId').get(authController.authorization, salesOrderDetailsController.findAllbySalesOrderId);
router.route('/create').post(authController.authorization, salesOrderDetailsController.create);
router.route('/update/:id').put(authController.authorization, salesOrderDetailsController.update);
router.route('/delete/:id').put(authController.authorization, salesOrderDetailsController.delete);
router.route('/:id').get(authController.authorization, salesOrderDetailsController.findById);

module.exports = router;
