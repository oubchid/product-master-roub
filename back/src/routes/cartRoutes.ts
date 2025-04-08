import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation middleware
const cartItemValidation = [
  body('productId').isInt().withMessage('Product ID must be an integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const updateCartItemValidation = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be 0 or greater'),
];

// Routes
router.get('/', authenticateToken, getCart);
router.post('/', authenticateToken, cartItemValidation, addToCart);
router.put(
  '/items/:itemId',
  authenticateToken,
  updateCartItemValidation,
  updateCartItem
);
router.delete('/items/:itemId', authenticateToken, removeFromCart);

export default router;
