var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers').auth;
const productStoresController = require('../controllers').productStores;

// Without Authentication
router.route('/viewImage/:fileName').get(productStoresController.viewImage);
router.route('/:id').get(productStoresController.findById);

// With Authentication
router.route('/').get(authController.authorization, productStoresController.findAll);
router.route('/count/all').get(authController.authorization, productStoresController.countAll);
router.route('/create').post(authController.authorization, upload.single('image'), productStoresController.create);
router.route('/update/:id').put(authController.authorization, upload.single('image'), productStoresController.update);
router.route('/delete/:id').put(authController.authorization, productStoresController.delete);

module.exports = router;
