const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const examController = require('../controllers/exam-controller');
const classController = require('../controllers/class-controller');
const retrive = require('../controllers/retrive-controller');
const dashboardController = require('../controllers/dashboard');
const authMiddleware = require('../middlewares/authmiddleware');
const { deleteNotice,deleteTeacher, updateTeacher, getTeacher } = require('../controllers/teacher-controller');
const { updateStudent, deleteStudent, getStudent } = require('../controllers/student-controller');
const aiController = require('../controllers/ai-controller');
const aiAuthMiddleware = require('../middlewares/ai-middleware');

// Teacher routes
router.delete('/teacher/:id', deleteTeacher);
router.put('/teacher/:id', updateTeacher);
router.get('/teacher/:id', getTeacher);
router.put('/teacher/status/:id', authController.updateTeacherStatus);

router.put('/settings/logo', authController.updateLogo);
router.put('/settings/schoolDetails', authController.updateSchoolDetails);
router.get('/school-settings', authController.getSchoolSettings);

//notice
router.delete('/notice/:id', deleteNotice);

// Student routes
router.delete('/student/:id', deleteStudent);
router.put('/student/:id', updateStudent);
router.get('/student/:id', getStudent);
router.post('/upgrade-students', authController.upgradeStudents);


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
router.route('/classes/:year').get(retrive.getClasses);
router.route('/gradesheet/:year').get(retrive.getGradesheet);

router.route('/exam-count/:year').get(dashboardController.upcomingExams);

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

// ledger routes
router.post('/ledger-configuration', authController.createLedgerConfiguration);
router.get('/ledger-configuration/:schoolName', authController.getLedgerConfiguration);
router.post('/generate-ledger-sheet', authController.generateLedgerSheet);

// Add this route to fetch classes assigned to a specific teacher
router.get('/assigned-class/:teacherId/:year', classController.getClassesByTeacher);
router.get('/teacher-class/:teacherId/:selectedYear', classController.getClassByTeacher);
router.get('/teacher/:teacherId/subjects', examController.getAssignedSubjects);

router.get('/class/:classId/:sec/:year', classController.getClassTeacherInfo);



// Add this route to fetch classes enrolled to a specific student
router.get('/student/:studentId/classes', classController.getClassesByStudent);


// New route for fetching teacher dashboard data
router.get('/teacher/dashboard/:teacherId', authMiddleware, async (req, res) => {
    const { teacherId } = req.params;
    try {
        const totalStudents = await classController.getTotalStudentsByTeacher(teacherId);
        const assignedClasses = await classController.getClassesByTeacher(teacherId);
        const upcomingExams = await examController.getUpcomingExamsByTeacher(teacherId);
        const averagePerformance = await classController.getAveragePerformanceByTeacher(teacherId);

        res.status(200).json({
            totalStudents,
            assignedClasses: assignedClasses.length,
            upcomingExams,
            averagePerformance
        });
    } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;