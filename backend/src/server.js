import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import Product from './models/Product.js';
import PricingAlgorithm from './services/PricingAlgorithm.js';
import { seedRealProducts, seedMockProducts } from './utils/productSeeder.js';
import productsRouter from './routes/products.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);

// Test Route
app.get('/api/test', (req, res) => {
	res.json({
		status: 'OK',
		message: 'DatumFlow API is running!',
		timestamp: new Date().toISOString(),
	});
});

app.get('/api/test/product', async (req, res) => {
	try {
		// Create test product
		const testProduct = new Product({
			name: 'Mjölk 3%',
			supplier: 'Arla',
			ean: 7310865000194,
			category: 'Mejeri',
			manufacturingDate: new Date('2026-01-01'),
			expiryDate: new Date('2026-01-05'),
			originalPrice: 15.9,
			currentPrice: 15.9,
			costPrice: 10.0,
			store: 'Main Store',
		});

		// Use PricingAlgorithm
		const pricingDetails = PricingAlgorithm.getPricingDetails(testProduct);
		const validation = PricingAlgorithm.validatePrice(
			pricingDetails.suggestedPrice,
			testProduct.costPrice
		);

		res.json({
			product: {
				name: testProduct.name,
				supplier: testProduct.supplier,
				category: testProduct.category,
				expiryDate: testProduct.expiryDate,
			},
			pricing: pricingDetails,
			validation: validation,
			message: 'Product model + PricingAlgorithm test successful',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Seed endpoint - Use real API data
app.post('/api/seed/real', async (req, res) => {
	try {
		const result = await seedRealProducts();
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Seed with MOCK data
app.post('/api/seed/mock', async (req, res) => {
	try {
		console.log('\nSeeding with mock data...');
		const result = await seedMockProducts();
		res.json(result);
	} catch (error) {
		console.error('Mock seed error:', error);
		res.status(500).json({ error: error.message });
	}
});

const PORT = process.env.PORT || 5000;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
			console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
			console.log(
				`Test Product: http://localhost:${PORT}/api/test/product`
			);
			console.log(`Get products: http://localhost:${PORT}/api/products`);
		});
	})
	.catch((error) => {
		console.error('Failed to connect to MongoDB:', error);
		process.exit(1);
	});
