import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  Wishlist,
  WishlistItem,
  CreateWishlistItemDTO,
} from '../models/Wishlist';
import { Product } from '../models/Product';

// In-memory data store
let wishlists: Wishlist[] = [];
let products: Product[] = [];

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const wishlist = wishlists.find((w) => w.userId === userId);

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.json(wishlist);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as any).user.userId;
    const { productId }: CreateWishlistItemDTO = req.body;

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = wishlists.find((w) => w.userId === userId);
    if (!wishlist) {
      wishlist = {
        id: wishlists.length + 1,
        userId,
        items: [],
        totalItems: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      wishlists.push(wishlist);
    }

    const existingItem = wishlist.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const newItem: WishlistItem = {
      id: wishlist.items.length + 1,
      userId,
      productId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      product,
    };
    wishlist.items.push(newItem);

    wishlist.totalItems = wishlist.items.length;
    wishlist.updatedAt = Date.now();

    res.json(wishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const itemId = parseInt(req.params.itemId);

    const wishlist = wishlists.find((w) => w.userId === userId);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter((item) => item.id !== itemId);

    wishlist.totalItems = wishlist.items.length;
    wishlist.updatedAt = Date.now();

    res.json(wishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
