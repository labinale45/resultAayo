const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const imgController = require('../controllers/img-controller');
const examController = require('../controllers/exam-controller');
const classController = require('../controllers/class-controller');
const setYears =  require('../controllers/retrive-controller');

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);
router.route('/publish-result').post(authController.publishResult);
router.route('/create-exam').post(examController.createExam); 
router.route('/create-class').post(classController.addClass);
router.route('/year').get(setYears.getYears);
// Remove or comment out the line below if it's not being used
// router.route('/admin')

module.exports = router;
