import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedMockProducts, seedRealProducts } from '../utils/productSeeder.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const runSeeder = async () => {
	try {
		// Connect to database
		await connectDB();

		console.log('Starting database seeding...\n');

		// Check command line argument
		const seedType = process.argv[2] || 'mock';

		let result;
		if (seedType === 'real') {
			console.log('Using REAL products from Open Food Facts API...\n');
			result = await seedRealProducts();
		} else {
			console.log('Using MOCK Swedish grocery products...\n');
			result = await seedMockProducts();
		}

		if (result.success) {
			console.log('Database seeding completed successfully!');
		} else {
			console.log('Seeding completed with warnings');
		}

		process.exit(0);
	} catch (error) {
		console.error('Seeding failed:', error);
		process.exit(1);
	}
};

runSeeder();
