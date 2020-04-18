var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const frontendUsefulLinksController = require('../controllers').frontendUsefulLinks;

router.route('/').get(frontendUsefulLinksController.findAll);
router.route('/create').post(authController.authorization, frontendUsefulLinksController.create);
router.route('/update/:id').put(authController.authorization, frontendUsefulLinksController.update);
router.route('/delete/:id').put(authController.authorization, frontendUsefulLinksController.delete);
router.route('/search/:value').get(authController.authorization, frontendUsefulLinksController.search);
router.route('/:id').get(authController.authorization, frontendUsefulLinksController.findById);

module.exports = router;
