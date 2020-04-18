var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const frontendPolicyPages = require('../controllers').frontendPolicyPages;

router.route('/').get(authController.authorization, frontendPolicyPages.findAll);
router.route('/findOneByType/:type').get(authController.authorization, frontendPolicyPages.findOneByType);
router.route('/create').post(authController.authorization, frontendPolicyPages.create);
router.route('/update/:id').put(authController.authorization, frontendPolicyPages.update);
router.route('/delete/:id').put(authController.authorization, frontendPolicyPages.delete);
router.route('/search/:value').get(authController.authorization, frontendPolicyPages.search);
router.route('/:id').get(authController.authorization, frontendPolicyPages.findById);

module.exports = router;
