import { describe, test, expect } from 'vitest';
import Product from './Product.js';

// Create test product
const createTestProduct = (overrides = {}) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const defaultProduct = {
		name: 'Test Mjölk',
		supplier: 'Arla',
		ean: '7310865999999',
		category: 'Mejeri',
		commodityGroup: '510',
		weight: '1 liter',
		manufacturingDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
		expiryDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
		originalPrice: 25.9,
		currentPrice: 25.9,
		costPrice: 16.84,
	};

	return { ...defaultProduct, ...overrides };
};

describe('Product Model - days calculation', () => {
	test('should calculate days until expiry correctly', () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const futureDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

		const product = new Product(
			createTestProduct({ expiryDate: futureDate })
		);
		expect(product.getDaysUntilExpiry()).toBe(5);
	});

	test('should return negative days for expired products', () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const pastDate = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

		const product = new Product(
			createTestProduct({ expiryDate: pastDate })
		);
		expect(product.getDaysUntilExpiry()).toBe(-2);
	});
});

describe('Product Model - Urgency', () => {
	test('should return correct urgency for each zone', () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Red zone: 0-1 days
		const redProduct = new Product(
			createTestProduct({
				expiryDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
			})
		);
		expect(redProduct.getUrgencyLevel()).toBe('red');

		// Orange zone: 2-3 days
		const orangeProduct = new Product(
			createTestProduct({
				expiryDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
			})
		);
		expect(orangeProduct.getUrgencyLevel()).toBe('orange');

		// Yellow zone: 4-5 days
		const yellowProduct = new Product(
			createTestProduct({
				expiryDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
			})
		);
		expect(yellowProduct.getUrgencyLevel()).toBe('yellow');

		// Green zone: 6+ days
		const greenProduct = new Product(
			createTestProduct({
				expiryDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
			})
		);
		expect(greenProduct.getUrgencyLevel()).toBe('green');
	});
});

describe('Product Model - Status handling', () => {
	test('should mark product as handled', async () => {
		const product = new Product(createTestProduct());

		product.save = async function () {
			return this;
		};

		await product.markAsHandled('Butikspersonal');

		expect(product.priceStatus).toBe('handled');
		expect(product.handledBy).toBe('Butikspersonal');
		expect(product.handledAt).toBeInstanceOf(Date);
	});

	test('should increment expiry count', async () => {
		const product = new Product(createTestProduct({ expiryCount: 2 }));

		product.save = async function () {
			return this;
		};

		await product.incrementExpiryCount();
		expect(product.expiryCount).toBe(3);
	});
});
