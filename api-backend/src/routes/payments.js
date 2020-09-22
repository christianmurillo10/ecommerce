var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const paymentsController = require('../controllers').payments;

router.route('/create').post(authController.authorization, paymentsController.create);
router.route('/update/:id').put(authController.authorization, paymentsController.update);
router.route('/delete/:id').put(authController.authorization, paymentsController.delete);
router.route('/search/:value').get(authController.authorization, paymentsController.search);
router.route('/').get(authController.authorization, paymentsController.findAll);
router.route('/:id').get(authController.authorization, paymentsController.findById);

module.exports = router;
