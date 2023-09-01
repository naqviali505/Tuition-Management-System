import express from 'express';
import {requireSignin} from '../middlewares/index.js';
import {register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    currentUser} 
    from '../controllers/auth' 
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', requireSignin, currentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
module.exports = router;