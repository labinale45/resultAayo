const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const imgController = require('../controllers/img-controller');
const examController = require('../controllers/exam-controller');

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);
router.route('/publish-result').post(authController.publishResult);
router.route('/create-exam').post(examController.createExam); 
// Remove or comment out the line below if it's not being used
// router.route('/admin')

module.exports = router;
