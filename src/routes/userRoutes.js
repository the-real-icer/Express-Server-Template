import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// __________________Signup/Login/Check Token/Forgot & Reset Password Routes_____//
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// _______Protects all routes below this line____Only Current Logged In User Can Access_____\\
router.use(authController.protect);

// _______________User Profile Update & Delete Action Routes__________\\
router.patch('/update-my-password', authController.updatePassword);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

export default router;
