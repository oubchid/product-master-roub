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
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const express_validator_1 = require("express-validator");
// Simuler une base de données en mémoire
let wishlists = [];
let products = [];
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const wishlist = wishlists.find((w) => w.userId === userId);
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.json(wishlist);
    }
    catch (error) {
        console.error('Error getting wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getWishlist = getWishlist;
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user.userId;
        const { productId } = req.body;
        // Vérifier si le produit existe
        const product = products.find((p) => p.id === productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Trouver ou créer la liste de souhaits de l'utilisateur
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
        // Vérifier si le produit est déjà dans la liste de souhaits
        const existingItem = wishlist.items.find((item) => item.productId === productId);
        if (existingItem) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        const newItem = {
            id: wishlist.items.length + 1,
            userId,
            productId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            product,
        };
        wishlist.items.push(newItem);
        // Mettre à jour les totaux
        wishlist.totalItems = wishlist.items.length;
        wishlist.updatedAt = Date.now();
        res.json(wishlist);
    }
    catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addToWishlist = addToWishlist;
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const itemId = parseInt(req.params.itemId);
        const wishlist = wishlists.find((w) => w.userId === userId);
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        wishlist.items = wishlist.items.filter((item) => item.id !== itemId);
        // Mettre à jour les totaux
        wishlist.totalItems = wishlist.items.length;
        wishlist.updatedAt = Date.now();
        res.json(wishlist);
    }
    catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.removeFromWishlist = removeFromWishlist;
