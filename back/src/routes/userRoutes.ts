import { Router } from 'express';
import { body } from 'express-validator';
import { createUser, login, getProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation middleware
const createUserValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('firstname').trim().notEmpty().withMessage('Firstname is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/account', createUserValidation, createUser);
router.post('/token', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);

export default router;
