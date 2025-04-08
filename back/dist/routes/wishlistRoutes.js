"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const wishlistController_1 = require("../controllers/wishlistController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Validation middleware
const wishlistItemValidation = [
    (0, express_validator_1.body)('productId').isInt().withMessage('Product ID must be an integer'),
];
// Routes
router.get('/', auth_1.authenticateToken, wishlistController_1.getWishlist);
router.post('/', auth_1.authenticateToken, wishlistItemValidation, wishlistController_1.addToWishlist);
router.delete('/items/:itemId', auth_1.authenticateToken, wishlistController_1.removeFromWishlist);
exports.default = router;
