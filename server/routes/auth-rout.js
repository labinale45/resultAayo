const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const imgController = require('../controllers/img-controller');
const examController = require('../controllers/exam-controller');
const classController = require('../controllers/class-controller');
const retrive =  require('../controllers/retrive-controller');
const dashboardController = require('../controllers/dashboard');

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);
router.route('/publish-result').post(authController.publishResult);
router.route('/create-exam').post(examController.createExam); 
router.route('/create-notice').post(examController.createNotice);
router.route('/create-class').post(classController.addClass);
router.route('/year').get(retrive.getYears);
router.route('/records/:year').get(retrive.getRecordsByYear);

// Add new dashboard routes
router.route('/dashboard/counts').get(dashboardController.dashboard);
router.route('/dashboard/history').get(dashboardController.getHistory);

module.exports = router;
