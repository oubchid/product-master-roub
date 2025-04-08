"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Validation middleware
const cartItemValidation = [
    (0, express_validator_1.body)('productId').isInt().withMessage('Product ID must be an integer'),
    (0, express_validator_1.body)('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];
const updateCartItemValidation = [
    (0, express_validator_1.body)('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be 0 or greater'),
];
// Routes
router.get('/', auth_1.authenticateToken, cartController_1.getCart);
router.post('/', auth_1.authenticateToken, cartItemValidation, cartController_1.addToCart);
router.put('/items/:itemId', auth_1.authenticateToken, updateCartItemValidation, cartController_1.updateCartItem);
router.delete('/items/:itemId', auth_1.authenticateToken, cartController_1.removeFromCart);
exports.default = router;
