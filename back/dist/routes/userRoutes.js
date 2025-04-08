"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Validation middleware
const createUserValidation = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    (0, express_validator_1.body)('firstname').trim().notEmpty().withMessage('Firstname is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
// Routes
router.post('/account', createUserValidation, userController_1.createUser);
router.post('/token', loginValidation, userController_1.login);
router.get('/profile', auth_1.authenticateToken, userController_1.getProfile);
exports.default = router;
