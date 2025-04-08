"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// In-memory data store
let users = [];
let carts = [];
let wishlists = [];
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userData = req.body;
        // Check if email is already registered
        if (users.find((user) => user.email === userData.email)) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
        // Create new user
        const newUser = Object.assign(Object.assign({ id: users.length + 1 }, userData), { password: hashedPassword, createdAt: Date.now(), updatedAt: Date.now() });
        users.push(newUser);
        // Initialize empty cart
        const newCart = {
            id: carts.length + 1,
            userId: newUser.id,
            items: [],
            totalItems: 0,
            totalPrice: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        carts.push(newCart);
        // Initialize empty wishlist
        const newWishlist = {
            id: wishlists.length + 1,
            userId: newUser.id,
            items: [],
            totalItems: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        wishlists.push(newWishlist);
        // Return user without password
        const { password } = newUser, userResponse = __rest(newUser, ["password"]);
        res.status(201).json(userResponse);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user by email
        const user = users.find((u) => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Verify password
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            isAdmin: user.email === 'admin@admin.com',
        }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const user = users.find((u) => u.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password } = user, userResponse = __rest(user, ["password"]);
        res.json(userResponse);
    }
    catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getProfile = getProfile;
