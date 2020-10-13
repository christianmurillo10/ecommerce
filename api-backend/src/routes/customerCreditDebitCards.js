var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const customerCreditDebitCardsController = require('../controllers').customerCreditDebitCards;

router.route('/').get(authController.authorization, customerCreditDebitCardsController.findAll);
router.route('/findAllbyCustomerId/:customerId').get(authController.authorization, customerCreditDebitCardsController.findAllbyCustomerId);
router.route('/create').post(authController.authorization, customerCreditDebitCardsController.create);
router.route('/update/:id').put(authController.authorization, customerCreditDebitCardsController.update);
router.route('/delete/:id').put(authController.authorization, customerCreditDebitCardsController.delete);
router.route('/:id').get(authController.authorization, customerCreditDebitCardsController.findById);

module.exports = router;
