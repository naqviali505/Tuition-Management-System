import express from 'express';
import {requireSignin} from '../middlewares/index.js';
import {
    makeInstructor,
    getAccountStatus,
    currentInstructor,
    instructorCourses,
    studentCount,
    instructorBalance,
    instructorPayoutSettings,

    
} from '../controllers/instructor' 
const router = express.Router();
router.post('/make-instructor', requireSignin, makeInstructor);
router.post('/get-account-status', requireSignin, getAccountStatus);
router.get('/get-current-instructor', requireSignin,currentInstructor );
router.get('/instructor-courses', requireSignin,instructorCourses );
router.post('/instructor/student-count', requireSignin, studentCount);

router.get('/instructor/balance', requireSignin, instructorBalance);

router.get('/instructor/payout-settings', requireSignin, instructorPayoutSettings)

module.exports = router;