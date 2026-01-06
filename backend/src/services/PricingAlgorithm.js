// Handles all pricing calculations based on expiry dates

class PricingAlgorithm {
	// Discount rules based on days until expiry, matches color coding.
	static discountRules = {
		'0-1': 0.5,
		'2-3': 0.75,
		'4-5': 0.85,
	};

	// Calculate suggested price for a product
	static calculatePrice(product) {
		const daysLeft = product.getDaysUntilExpiry();
		const discountRate = this.getDiscountRate(daysLeft);

		return product.originalPrice * discountRate;
	}

	// Get discount rate based on days until expiry
	static getDiscountRate(daysLeft) {
		if (daysLeft <= 1) return this.discountRules['0-1'];
		if (daysLeft <= 3) return this.discountRules['2-3'];
		if (daysLeft <= 5) return this.discountRules['4-5'];

		return 1.0; // No discount
	}

	// Apply discount to price manually
	static applyDiscount(price, rate) {
		if (rate <= 0 || rate > 1) {
			throw new Error('Invalid discount rate. Must be between 0 and 1.');
		}
		return price * rate;
	}

	// Validate new price against cost price
	static validatePrice(newPrice, costPrice) {
		if (newPrice < 0.01) {
			return {
				valid: false,
				warning: 'Price cannot be less than 0.01 SEK',
			};
		}

		if (costPrice && newPrice < costPrice) {
			return {
				valid: true,
				warning: 'Warning, selling below cost price!',
			};
		}

		return {
			valid: true,
			warning: null,
		};
	}

	// Calculate all pricing details for product
	static getPricingDetails(product) {
		const daysLeft = product.getDaysUntilExpiry();
		const suggestedPrice = this.calculatePrice(product);
		const discountAmount = product.originalPrice - suggestedPrice;
		const discountPercentage = (
			(discountAmount / product.originalPrice) *
			100
		).toFixed(2);

		return {
			originalPrice: product.originalPrice,
			currentPrice: product.currentPrice,
			suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
			discountAmount: parseFloat(discountAmount.toFixed(2)),
			discountPercentage: parseFloat(discountPercentage),
			daysUntilExpiry: daysLeft,
			urgencyLevel: product.getUrgencyLevel(),
		};
	}
}

export default PricingAlgorithm;
