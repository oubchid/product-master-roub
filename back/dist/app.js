"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
// Routes
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Documentation
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// API Routes
app.use('/products', productRoutes_1.default);
app.use('/account', userRoutes_1.default);
app.use('/cart', cartRoutes_1.default);
app.use('/wishlist', wishlistRoutes_1.default);
// Health check endpoint
app.get('/health', (_, res) => res.json({ status: 'OK' }));
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API documentation: http://localhost:${port}/api-docs`);
});
