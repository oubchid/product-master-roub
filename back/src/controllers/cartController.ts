import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  Cart,
  CartItem,
  CreateCartItemDTO,
  UpdateCartItemDTO,
} from '../models/Cart';
import { Product } from '../models/Product';

// Simulate DB
let carts: Cart[] = [];
let products: Product[] = [];

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const cart = carts.find((c) => c.userId === userId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as any).user.userId;
    const { productId, quantity }: CreateCartItemDTO = req.body;

    // Check product
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create user cart
    let cart = carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        id: carts.length + 1,
        userId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      carts.push(cart);
    }

    // Check priduct in cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.updatedAt = Date.now();
    } else {
      const newItem: CartItem = {
        id: cart.items.length + 1,
        userId,
        productId,
        quantity,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        product,
      };
      cart.items.push(newItem);
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0
    );
    cart.updatedAt = Date.now();

    res.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as any).user.userId;
    const itemId = parseInt(req.params.itemId);
    const { quantity } = req.body as UpdateCartItemDTO;

    const cart = carts.find((c) => c.userId === userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity && quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else if (quantity) {
      item.quantity = quantity;
      item.updatedAt = Date.now();
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0
    );
    cart.updatedAt = Date.now();

    res.json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const itemId = parseInt(req.params.itemId);

    const cart = carts.find((c) => c.userId === userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.id !== itemId);

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0
    );
    cart.updatedAt = Date.now();

    res.json(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
