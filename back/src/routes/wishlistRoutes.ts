import { Router } from 'express';
import { body } from 'express-validator';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation middleware
const wishlistItemValidation = [
  body('productId').isInt().withMessage('Product ID must be an integer'),
];

// Routes
router.get('/', authenticateToken, getWishlist);
router.post('/', authenticateToken, wishlistItemValidation, addToWishlist);
router.delete('/items/:itemId', authenticateToken, removeFromWishlist);

export default router;
