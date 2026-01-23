import { describe, test, expect } from 'vitest';
import PricingAlgorithm from './PricingAlgorithm.js';

// Mock product
const createMockProduct = (
	daysUntilExpiry,
	originalPrice = 100,
	costPrice = 65
) => {
	return {
		originalPrice,
		currentPrice: originalPrice,
		costPrice,
		expiryDate: new Date(
			Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000
		),
		getDaysUntilExpiry: function () {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const expiry = new Date(this.expiryDate);
			expiry.setHours(0, 0, 0, 0);
			const diffTime = expiry - today;
			return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		},
		getUrgencyLevel: function () {
			const days = this.getDaysUntilExpiry();
			if (days <= 1) return 'red';
			if (days <= 3) return 'orange';
			if (days <= 5) return 'yellow';
			return 'green';
		},
	};
};

describe('PricingAlgorithm - discount calculations', () => {
	test('should return 0.5 (50% discount) for red zone (0-1 days)', () => {
		expect(PricingAlgorithm.getDiscountRate(0)).toBe(0.5);
		expect(PricingAlgorithm.getDiscountRate(1)).toBe(0.5);
	});

	test('should return 0.75 (25% discount) for orange zone (2-3 days)', () => {
		expect(PricingAlgorithm.getDiscountRate(2)).toBe(0.75);
		expect(PricingAlgorithm.getDiscountRate(3)).toBe(0.75);
	});

	test('should return 0.85 (15% discount) for yellow zone (4-5 days)', () => {
		expect(PricingAlgorithm.getDiscountRate(4)).toBe(0.85);
		expect(PricingAlgorithm.getDiscountRate(5)).toBe(0.85);
	});

	test('should return 1.0 (no discount) for green zone (6+ days)', () => {
		expect(PricingAlgorithm.getDiscountRate(6)).toBe(1.0);
		expect(PricingAlgorithm.getDiscountRate(10)).toBe(1.0);
		expect(PricingAlgorithm.getDiscountRate(30)).toBe(1.0);
	});
});

describe('PricingAlgorithm - Price calculations', () => {
	test('should calculate correct suggested price for red zone product', () => {
		const product = createMockProduct(1, 100); // 1 day left, 100 SEK
		const suggestedPrice = PricingAlgorithm.calculatePrice(product);
		expect(suggestedPrice).toBe(50); // 50% of 100
	});

	test('should calculate correct suggested price for orange zone product', () => {
		const product = createMockProduct(3, 100); // 3 days left, 100 SEK
		const suggestedPrice = PricingAlgorithm.calculatePrice(product);
		expect(suggestedPrice).toBe(75); // 75% of 100
	});

	test('should calculate correct suggested price for yellow zone product', () => {
		const product = createMockProduct(5, 100); // 5 days left, 100 SEK
		const suggestedPrice = PricingAlgorithm.calculatePrice(product);
		expect(suggestedPrice).toBe(85); // 85% of 100
	});

	test('should not suggest discount for green zone product', () => {
		const product = createMockProduct(7, 100); // 7 days left, 100 SEK
		const suggestedPrice = PricingAlgorithm.calculatePrice(product);
		expect(suggestedPrice).toBe(100); // No discount
	});
});

describe('PricingAlgorithm - Manual discounts', () => {
	test('should apply discount rate correctly', () => {
		expect(PricingAlgorithm.applyDiscount(100, 0.5)).toBe(50);
		expect(PricingAlgorithm.applyDiscount(100, 0.75)).toBe(75);
		expect(PricingAlgorithm.applyDiscount(50, 0.5)).toBe(25);
	});

	test('should throw error for invalid discount rate (<=0)', () => {
		expect(() => PricingAlgorithm.applyDiscount(100, 0)).toThrow(
			'Invalid discount rate'
		);
		expect(() => PricingAlgorithm.applyDiscount(100, -0.5)).toThrow(
			'Invalid discount rate'
		);
	});

	test('should throw error for invalid discount rate (>1)', () => {
		expect(() => PricingAlgorithm.applyDiscount(100, 1.5)).toThrow(
			'Invalid discount rate'
		);
	});
});

describe('PricingAlgorithm - Price validation', () => {
	test('should reject prices below 0.01 SEK', () => {
		const validation = PricingAlgorithm.validatePrice(0, 10);
		expect(validation.valid).toBe(false);
		expect(validation.warning).toBe('Price cannot be less than 0.01 SEK');
	});

	test('should warn when price is below cost price', () => {
		const validation = PricingAlgorithm.validatePrice(50, 60);
		expect(validation.valid).toBe(true);
		expect(validation.warning).toBe('Warning, selling below cost price!');
	});

	test('should accept valid price above cost price', () => {
		const validation = PricingAlgorithm.validatePrice(80, 60);
		expect(validation.valid).toBe(true);
		expect(validation.warning).toBe(null);
	});

	test('should accept price equal to cost price', () => {
		const validation = PricingAlgorithm.validatePrice(60, 60);
		expect(validation.valid).toBe(true);
		expect(validation.warning).toBe(null);
	});

	test('should handle validation when costPrice is undefined', () => {
		const validation = PricingAlgorithm.validatePrice(50, undefined);
		expect(validation.valid).toBe(true);
		expect(validation.warning).toBe(null);
	});
});

describe('PricingAlgorithm - Complete pricing details', () => {
	test('should return complete pricing details for red zone product', () => {
		const product = createMockProduct(1, 100, 65);
		const details = PricingAlgorithm.getPricingDetails(product);

		expect(details.originalPrice).toBe(100);
		expect(details.currentPrice).toBe(100);
		expect(details.suggestedPrice).toBe(50);
		expect(details.discountAmount).toBe(50);
		expect(details.discountPercentage).toBe(50);
		expect(details.daysUntilExpiry).toBe(1);
		expect(details.urgencyLevel).toBe('red');
	});

	test('should return complete pricing details for orange zone product', () => {
		const product = createMockProduct(3, 80, 52);
		const details = PricingAlgorithm.getPricingDetails(product);

		expect(details.originalPrice).toBe(80);
		expect(details.suggestedPrice).toBe(60);
		expect(details.discountAmount).toBe(20);
		expect(details.discountPercentage).toBe(25);
		expect(details.daysUntilExpiry).toBe(3);
		expect(details.urgencyLevel).toBe('orange');
	});

	test('should handle decimal prices correctly', () => {
		const product = createMockProduct(1, 29.9, 19.44);
		const details = PricingAlgorithm.getPricingDetails(product);

		expect(details.suggestedPrice).toBe(14.95);
		expect(details.discountAmount).toBe(14.95);
		expect(typeof details.discountPercentage).toBe('number');
	});
});

describe('PricingAlgorithm - Edge cases', () => {
	test('should handle product with negative days (expired)', () => {
		const product = createMockProduct(-1, 100);
		const details = PricingAlgorithm.getPricingDetails(product);

		expect(details.urgencyLevel).toBe('red');
		expect(details.daysUntilExpiry).toBe(-1);
	});

	test('should handle high original price', () => {
		const product = createMockProduct(1, 1000, 650);
		const details = PricingAlgorithm.getPricingDetails(product);

		expect(details.suggestedPrice).toBe(500);
		expect(details.discountAmount).toBe(500);
	});

	test('should handle low original price', () => {
		const product = createMockProduct(1, 5, 3.25);
		const details = PricingAlgorithm.getPricingDetails(product);

		expect(details.suggestedPrice).toBe(2.5);
		expect(details.discountPercentage).toBe(50);
	});
});
