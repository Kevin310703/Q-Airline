import express from 'express';
import { register, login, authenticateToken, verifyEmail } from '../controller/authController.js';
import { getUserRole, verifyToken } from '../data/getUserMeLoader.js'

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/role/:userId', getUserRole);
router.get('/user-info', verifyToken, authenticateToken);

export default router;
