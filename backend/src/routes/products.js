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

// Update product price and mark as handled
router.put('/:id/price', async (req, res) => {
	try {
		const { id } = req.params;
		const { newPrice, staffMember } = req.body;

		// Validate input
		if (!newPrice || newPrice <= 0) {
			return res.status(400).json({
				success: false,
				error: 'Valid newPrice is required',
			});
		}

		// Find product
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({
				success: false,
				error: 'Product not found',
			});
		}

		// Validate price against cost price
		const validation = PricingAlgorithm.validatePrice(
			newPrice,
			product.costPrice
		);

		if (!validation.valid) {
			return res.status(400).json({
				success: false,
				error: validation.warning,
			});
		}

		// Log warning if selling below cost
		if (validation.warning) {
			console.log('Warning', validation.warning);
		}

		// Update price and mark as handled
		product.currentPrice = parseFloat(newPrice);
		product.priceStatus = 'handled';
		product.handledAt = new Date();
		product.handledBy = staffMember || 'Staff';

		// Increment expiry count (this product was about to expire)
		product.expiryCount += 1;

		await product.save();

		// Return success with updated product
		res.json({
			success: true,
			message: 'Product price updated successfully',
			product: product.toObject(),
			warning: validation.warning,
		});
	} catch (error) {
		console.error('Error updating product price:', error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

export default router;
