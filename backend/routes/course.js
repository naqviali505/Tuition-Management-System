import {isInstructor,requireSignin,isEnrolled} from '../middlewares/index.js';
import formidable from 'express-formidable';
import {
    uploadImage,
    removeImage,
    create,
    read,
    uploadVideo,
    removeVideo,
    addLesson,
    update,
    removeLesson,
    updateLesson,
    publishCourse,
    unpublishCourse,
    courses,
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess,
    userCourses,
    markCompleted,
    listCompleted,
    listIncomplete,





    
} 
from '../controllers/course' 
const express =require('express');
const router = express.Router();

router.get('/courses',courses);
router.post('/course/upload-image', uploadImage  );
router.post('/course/remove-image',removeImage  );

router.post('/course', requireSignin, isInstructor, create);
router.put('/course/:slug', requireSignin, update);
router.get('/course/:slug', read);
router.post('/course/video-upload/:instructorId', requireSignin, formidable({maxFieldsSize:500*1024*1024}) ,uploadVideo);
router.post('/course/video-remove/:instructorId', requireSignin ,removeVideo);
router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson);

router.put('/course/:slug/:lessonId', requireSignin, removeLesson);
//publish courses

router.put('/course/publish/:courseId', requireSignin, publishCourse);
router.put('/course/publish/:courseId', requireSignin, unpublishCourse);


router.get('/check-enrollment/:courseId', requireSignin, checkEnrollment);
//enrollment
router.post(`/free-enrollment/:courseId`, requireSignin, freeEnrollment);
router.post(`/paid-enrollment/:courseId`, requireSignin, paidEnrollment);

router.get('/stripe-success/:courseId', requireSignin, stripeSuccess);
router.get('/user-courses', requireSignin, userCourses);
router.get(`/user/course/:slug`, requireSignin,isEnrolled, read);



// mark completed
router.post('/mark-completed', requireSignin, markCompleted);
router.post('/list-completed', requireSignin, listCompleted);
router.post('/mark-incomplete', requireSignin, listIncomplete);

module.exports = router;