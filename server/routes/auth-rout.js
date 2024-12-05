const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const examController = require('../controllers/exam-controller');
const classController = require('../controllers/class-controller');
const retrive = require('../controllers/retrive-controller');
const dashboardController = require('../controllers/dashboard');
const authMiddleware = require('../middlewares/authmiddleware');
const { deleteTeacher, updateTeacher, getTeacher } = require('../controllers/teacher-controller');
const { updateStudent, deleteStudent, getStudent } = require('../controllers/student-controller');
const aiController = require('../controllers/ai-controller');
const aiAuthMiddleware = require('../middlewares/ai-middleware');

// Teacher routes
router.delete('/teacher/:id', deleteTeacher);
router.put('/teacher/:id', updateTeacher);
router.get('/teacher/:id', getTeacher);
router.put('/teacher/status/:id', authController.updateTeacherStatus);

// Student routes
router.delete('/student/:id', deleteStudent);
router.put('/student/:id', updateStudent);
router.get('/student/:id', getStudent);

// Auth routes
router.route('/login').post(authController.login);
router.route('/register').post(authController.register);

// Profile routes
router.route('/profile/:username').get(authController.getUserProfile);
router.route('/profile/update').put(authController.updateUserProfile);

// Academic routes
router.route('/publish-result').post(authController.publishResult);
router.route('/ledger-status').post(authController.getLedgerStatus);
router.route('/create-exam').post(examController.createExam); 
router.route('/create-notice').post(examController.createNotice);

// Class routes
router.route('/create-class').post(classController.addClass);
router.route('/subjects/:classId').get(classController.getSubjectsByClass);
router.route('/assign-teacher').post(classController.assignTeacher);
router.route('/teachers').get(classController.getTeachers);

// Data retrieval routes
router.route('/year').get(retrive.getYears);
router.route('/records/:year').get(retrive.getRecordsByYear);
router.route('/studentRecords/:year').get(retrive.getRecordsByYearAndClass);   
router.route('/exam-types').get(retrive.getExamTypes); // Updated to handle exam types by year
router.route('/classes').get(retrive.getClasses);

// Marks routes
router.route('/setup-marks').post(examController.setupMarks);
router.route('/marks').get(examController.getMarksData);
router.route('/enter-marks').post(examController.enterMarks);
router.route('/retrieve-marks').get(examController.retrieveMarks);


// Dashboard routes
router.route('/dashboard/counts').get(dashboardController.dashboard);
router.route('/dashboard/history').get(dashboardController.getHistory);

// AI routes
router.route('/ai-response').post(aiController.getAIResponse);

// New route for fetching subjects by class ID
router.route('/subjects').get(examController.getSubjectsByClass);

// Add this route to fetch classes assigned to a specific teacher
router.get('/teacher/:teacherId/classes', classController.getClassesByTeacher);
router.get('/teacher/:teacherId/subjects', examController.getAssignedSubjects);

module.exports = router;