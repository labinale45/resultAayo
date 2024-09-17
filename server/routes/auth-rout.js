const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const imgController = require('../controllers/img-controller');

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);
//router.route('/imgUpload').post(imgController.imageUpload);


module.exports = router;

