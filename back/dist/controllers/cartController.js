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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const express_validator_1 = require("express-validator");
// Simuler une base de données en mémoire
let carts = [];
let products = [];
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const cart = carts.find((c) => c.userId === userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    }
    catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user.userId;
        const { productId, quantity } = req.body;
        // Vérifier si le produit existe
        const product = products.find((p) => p.id === productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Trouver ou créer le panier de l'utilisateur
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
        // Vérifier si le produit est déjà dans le panier
        const existingItem = cart.items.find((item) => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.updatedAt = Date.now();
        }
        else {
            const newItem = {
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
        // Mettre à jour les totaux
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => { var _a; return sum + item.quantity * (((_a = item.product) === null || _a === void 0 ? void 0 : _a.price) || 0); }, 0);
        cart.updatedAt = Date.now();
        res.json(cart);
    }
    catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addToCart = addToCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user.userId;
        const itemId = parseInt(req.params.itemId);
        const { quantity } = req.body;
        const cart = carts.find((c) => c.userId === userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const item = cart.items.find((i) => i.id === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        if (quantity && quantity <= 0) {
            // Supprimer l'item si la quantité est 0 ou négative
            cart.items = cart.items.filter((i) => i.id !== itemId);
        }
        else if (quantity) {
            item.quantity = quantity;
            item.updatedAt = Date.now();
        }
        // Mettre à jour les totaux
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => { var _a; return sum + item.quantity * (((_a = item.product) === null || _a === void 0 ? void 0 : _a.price) || 0); }, 0);
        cart.updatedAt = Date.now();
        res.json(cart);
    }
    catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateCartItem = updateCartItem;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const itemId = parseInt(req.params.itemId);
        const cart = carts.find((c) => c.userId === userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter((item) => item.id !== itemId);
        // Mettre à jour les totaux
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => { var _a; return sum + item.quantity * (((_a = item.product) === null || _a === void 0 ? void 0 : _a.price) || 0); }, 0);
        cart.updatedAt = Date.now();
        res.json(cart);
    }
    catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.removeFromCart = removeFromCart;
