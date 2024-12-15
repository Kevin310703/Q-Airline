import express from 'express';
import {
    register,
    login,
    logout,
    authenticateToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refreshToken
} from '../controller/authController.js';
import { getUserRole, verifyToken } from '../data/getUserMeLoader.js'

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.get('/role/:userId', getUserRole);
router.get('/user-info', verifyToken, authenticateToken);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
