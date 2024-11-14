const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const examController = require('../controllers/exam-controller');
const classController = require('../controllers/class-controller');
const retrive =  require('../controllers/retrive-controller');
const dashboardController = require('../controllers/dashboard');
const authMiddleware = require('../middlewares/authmiddleware');
const { deleteTeacher, updateTeacher,getTeacher } = require('../controllers/teacher-controller');

// Teacher routes
router.delete('/teacher/:id', deleteTeacher);
router.put('/teacher/:id', updateTeacher);
router.get('/teacher/:id', getTeacher);
// Auth routes
router.route('/login').post(authController.login);
router.route('/register').post(authController.register);

// Profile routes (no longer protected)
router.route('/profile/:username').get(authController.getUserProfile);
router.route('/profile/update').put(authController.updateUserProfile);

// Academic routes (no longer protected)
router.route('/publish-result').post(authController.publishResult);
router.route('/create-exam').post(examController.createExam); 
router.route('/create-notice').post(examController.createNotice);
router.route('/create-class').post(classController.addClass);

// Data retrieval routes (no longer protected)
router.route('/year').get(retrive.getYears);
router.route('/records/:year').get(retrive.getRecordsByYear);
router.route('/exam-types').get(retrive.getExamTypes);
router.route('/classes').get(retrive.getClasses);

// Add this new route
router.route('/enter-marks').post(examController.enterMarks);

// Dashboard routes (no longer protected)
router.route('/dashboard/counts').get(dashboardController.dashboard);
router.route('/dashboard/history').get(dashboardController.getHistory);

module.exports = router;

