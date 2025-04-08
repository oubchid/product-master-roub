"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
// New product
router.post('/', productController_1.productController.create);
// Get products list
router.get('/', productController_1.productController.getAll);
// Get product by ID
router.get('/:id', productController_1.productController.getById);
// Update product
router.patch('/:id', productController_1.productController.update);
// Delete product
router.delete('/:id', productController_1.productController.delete);
exports.default = router;
