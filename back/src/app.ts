import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Doc
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/products', productRoutes);
app.use('/account', userRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);

app.get('/health', (_, res) => res.json({ status: 'OK' }));

// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API documentation: http://localhost:${port}/api-docs`);
});
