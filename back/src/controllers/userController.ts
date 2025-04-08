import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  User,
  CreateUserDTO,
  UserLoginDTO,
  UserResponse,
} from '../models/User';
import { Cart, CartItem } from '../models/Cart';
import { Wishlist, WishlistItem } from '../models/Wishlist';

// In-memory data store
let users: User[] = [];
let carts: Cart[] = [];
let wishlists: Wishlist[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userData: CreateUserDTO = req.body;

    if (users.find((user) => user.email === userData.email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser: User = {
      id: users.length + 1,
      ...userData,
      password: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    users.push(newUser);

    const newCart: Cart = {
      id: carts.length + 1,
      userId: newUser.id,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    carts.push(newCart);

    const newWishlist: Wishlist = {
      id: wishlists.length + 1,
      userId: newUser.id,
      items: [],
      totalItems: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    wishlists.push(newWishlist);

    const { password, ...userResponse } = newUser;
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password }: UserLoginDTO = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.email === 'admin@admin.com',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
