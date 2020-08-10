var express = require('express');
var router = express.Router();
const authController = require('../controllers').auth;
const usersController = require('../controllers').users;

router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/register').post(usersController.create);
router.route('/').get(authController.authorization, usersController.findAll);
router.route('/create').post(authController.authorization, usersController.create);
router.route('/update/:id').put(authController.authorization, usersController.update);
router.route('/delete/:id').put(authController.authorization, usersController.delete);
router.route('/search/:value').get(authController.authorization, usersController.search);
router.route('/:id').get(authController.authorization, usersController.findById);

module.exports = router;
