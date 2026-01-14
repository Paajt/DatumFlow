import express from 'express';
import Product from '../models/Product.js';
import PricingAlgorithm from '../services/PricingAlgorithm.js';

const router = express.Router();

// GET all products with pricing details
router.get('/', async (req, res) => {
	try {
		// Fetch all products from database
		const products = await Product.find();

		// Add pricing details to each product
		const productsWithPricing = products.map((product) => {
			const pricingDetails = PricingAlgorithm.getPricingDetails(product);

			return {
				// Take all fields from DB
				...product.toObject(),
				// Pricing calculations
				pricing: pricingDetails,
			};
		});

		// Sort by urgency (most urgent first)
		const sortedProducts = productsWithPricing.sort((a, b) => {
			const urgencyOrder = { red: 0, orange: 1, yellow: 2, green: 3 };
			const urgencyA = urgencyOrder[a.pricing.urgencyLevel];
			const urgencyB = urgencyOrder[b.pricing.urgencyLevel];

			// If same urgency, sort by days until expiry
			if (urgencyA === urgencyB) {
				return a.pricing.daysUntilExpiry - b.pricing.daysUntilExpiry;
			}

			return urgencyA - urgencyB;
		});

		// Calculate summary statistics
		const stats = {
			total: sortedProducts.length,
			red: sortedProducts.filter((p) => p.pricing.urgencyLevel === 'red')
				.length,
			orange: sortedProducts.filter(
				(p) => p.pricing.urgencyLevel === 'orange'
			).length,
			yellow: sortedProducts.filter(
				(p) => p.pricing.urgencyLevel === 'yellow'
			).length,
			green: sortedProducts.filter(
				(p) => p.pricing.urgencyLevel === 'green'
			).length,
		};

		res.json({
			success: true,
			stats,
			count: sortedProducts.length,
			products: sortedProducts,
		});
	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

export default router;
