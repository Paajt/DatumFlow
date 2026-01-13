import axios from 'axios';
import Product from '../models/Product.js';
import { getCommodityGroup } from './commodityGroups.js';
import { mockProducts } from './mockProducts.js';

// Shelf life defaults per category (days)
const shelfLifeByCategory = {
	Mejeri: { min: 5, max: 14 },
	Mejeriprodukter: { min: 5, max: 14 },
	Yoghurts: { min: 5, max: 21 },
	Fisk: { min: 2, max: 5 },
	Kött: { min: 2, max: 5 },
	Charkuterier: { min: 7, max: 21 },
	Bageri: { min: 2, max: 7 },
	Grönsaker: { min: 2, max: 6 },
	Frukt: { min: 2, max: 5 },
	default: { min: 7, max: 30 },
};

// Price ranges by category (SEK)
const priceRangeByCategory = {
	Mejeri: { min: 15, max: 35 },
	Fisk: { min: 45, max: 120 },
	Kött: { min: 40, max: 150 },
	Bageri: { min: 20, max: 45 },
	default: { min: 15, max: 80 },
};

//Fetch real products from Open Food Facts API
async function fetchRealProducts(category = 'dairy', count = 20) {
	try {
		const searchTerms = {
			dairy: 'färsk mjölk',
			yogurt: 'färsk yoghurt',
			bread: 'färskt bröd',
			meat: 'färsk kyckling',
			fish: 'färsk lax',
			fruit: 'färska bananer',
			vegetables: 'färska tomater',
		};

		const url = `https://world.openfoodfacts.org/cgi/search.pl`;
		const params = {
			search_terms: searchTerms[category] || 'mat',
			search_simple: 1,
			action: 'process',
			json: 1,
			page_size: count,
			tagtype_0: 'countries',
			tag_contains_0: 'contains',
			tag_0: 'sweden',
			tag_type_1: 'categories',
			tag_contains_1: 'contains',
			tag_1: 'fresh',
			fields: 'product_name,code,brands,categories_tags,image_url',
		};

		console.log(`Fetching ${category} products from Open Food Facts...`);
		const response = await axios.get(url, {
			params,
			timeout: 10000,
		});

		if (response.data && response.data.products) {
			// Filter non-fresh products
			const freshProducts = response.data.products.filter((product) => {
				const name = product.product_name?.toLowerCase() || '';

				//Blacklist non-fresh words
				const blacklist = [
					'oil',
					'olja',
					'müsli',
					'soppa',
					'soup',
					'burk',
					'can',
					'konserv',
					'dried',
					'torkad',
					'powder',
					'pulver',
					'chips',
					'nuggets',
					'fryst',
					'frozen',
					'deepfrozen',
					'tortilla',
				];

				return !blacklist.some((word) => name.includes(word));
			});
			console.log(
				`Found ${freshProducts.length} fresh products (filtered from ${response.data.products.length})`
			);
			return freshProducts;
		}

		return [];
	} catch (error) {
		console.error('API Error:', error.message);
		// Return empty array instead of crashing
		return [];
	}
}

// Map Open Food Facts category to fit Datumflow categories
function mapCategory(categoriesTags = []) {
	const categoryMap = {
		dairy: 'Mejeri',
		yogurt: 'Mejeri',
		cheese: 'Ost',
		milk: 'Mejeri',
		meat: 'Kött',
		fish: 'Fisk',
		seafood: 'Fisk',
		bread: 'Bageri',
		bakery: 'Bageri',
		fruit: 'Frukt',
		vegetable: 'Grönsaker',
	};

	for (const tag of categoriesTags) {
		for (const [key, value] of Object.entries(categoryMap)) {
			if (tag.includes(key)) {
				return value;
			}
		}
	}

	return 'Diverse';
}

// Generate realistic expiry date based on category
function generateExpiryDate(category) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const shelfLife =
		shelfLifeByCategory[category] || shelfLifeByCategory.default;

	// Create distribution across urgency levels
	const random = Math.random();
	let daysUntilExpiry;

	if (random < 0.08) {
		// Red zone (0-1 days)
		daysUntilExpiry = Math.floor(Math.random() * 2);
	} else if (random < 0.18) {
		// Orange zone (2-3 days)
		daysUntilExpiry = 2 + Math.floor(Math.random() * 2);
	} else if (random < 0.3) {
		// Yellow zone (4-5 days)
		daysUntilExpiry = 4 + Math.floor(Math.random() * 2);
	} else {
		// Green zone (>5 days)
		daysUntilExpiry = 6 + Math.floor(Math.random() * (shelfLife.max - 5));
	}

	const expiryDate = new Date(today);
	expiryDate.setDate(today.getDate() + daysUntilExpiry);

	const manufacturingDate = new Date(today);
	manufacturingDate.setDate(today.getDate() - Math.floor(Math.random() * 3));

	return { expiryDate, manufacturingDate };
}

// Generate realistic price based on category
function generatePrice(category) {
	const priceRange =
		priceRangeByCategory[category] || priceRangeByCategory.default;
	const basePrice =
		priceRange.min + Math.random() * (priceRange.max - priceRange.min);

	// Round to nearest whole number and add .90 öre
	const originalPrice = Math.floor(basePrice) + 0.9;
	const costPrice = parseFloat((originalPrice * 0.65).toFixed(2)); // 35% margin

	return { originalPrice, costPrice };
}

// Seed database with real products from API
export async function seedRealProducts() {
	try {
		console.log('\nStarting Product Seeder with Real API Data...\n');

		// Clear existing products
		await Product.deleteMany({});
		console.log('Cleared existing products\n');

		const products = [];

		// Track unique EANs
		const seenEANs = new Set();

		// Fetch different categories
		const categories = [
			'dairy',
			'yoghurt',
			'bread',
			'meat',
			'fruit',
			'vegetables',
			'juice',
		];

		for (const category of categories) {
			const apiProducts = await fetchRealProducts(category, 10);

			for (const apiProduct of apiProducts) {
				if (!apiProduct.product_name || !apiProduct.code) continue;

				if (seenEANs.has(apiProduct.code)) {
					console.log(`Skipping duplicate EAN: ${apiProduct.code}`);
					continue;
				}

				const mappedCategory = mapCategory(
					apiProduct.categories_tags || []
				);
				const { expiryDate, manufacturingDate } =
					generateExpiryDate(mappedCategory);
				const { originalPrice, costPrice } =
					generatePrice(mappedCategory);

				const commodityGroup = getCommodityGroup(
					apiProduct.product_name,
					mappedCategory
				);

				// Debug log to see what commodity group was assigned
				console.log(
					` → ${apiProduct.product_name.substring(
						0,
						30
					)} → Vgr: ${commodityGroup}`
				);

				products.push({
					name: apiProduct.product_name.trim(),
					supplier: apiProduct.brands || 'Okänd leverantör',
					ean: apiProduct.code,
					category: mappedCategory,
					commodityGroup: commodityGroup,
					weight: apiProduct.weight,
					manufacturingDate,
					expiryDate,
					originalPrice,
					currentPrice: originalPrice,
					costPrice,
					store: 'Main Store',
					priceStatus: 'pending',
					expiryCount: Math.floor(Math.random() * 3),
				});

				// Mark as seen
				seenEANs.add(apiProduct.code);

				// Limit to reasonable amount
				if (products.length >= 40) break;
			}

			if (products.length >= 40) break;
		}

		// Insert products
		if (products.length === 0) {
			console.log('No products fetched, falling back to mock data...');
			return { success: false, message: 'No API data available' };
		}

		const inserted = await Product.insertMany(products);

		// Calculate statistics
		const stats = {
			total: inserted.length,
			red: 0,
			orange: 0,
			yellow: 0,
			green: 0,
			categories: {},
		};

		inserted.forEach((product) => {
			const urgency = product.getUrgencyLevel();
			stats[urgency]++;

			if (!stats.categories[product.category]) {
				stats.categories[product.category] = 0;
			}
			stats.categories[product.category]++;
		});

		console.log('\nProduct Seeder Complete!');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log(`📦 Total products: ${stats.total}`);
		console.log(`🔴 Red (0-1 days): ${stats.red}`);
		console.log(`🟠 Orange (2-3 days): ${stats.orange}`);
		console.log(`🟡 Yellow (4-5 days): ${stats.yellow}`);
		console.log(`🟢 Green (>5 days): ${stats.green}`);
		console.log('\nCategories:');
		Object.entries(stats.categories).forEach(([cat, count]) => {
			console.log(`   ${cat}: ${count}`);
		});
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

		return { success: true, stats };
	} catch (error) {
		console.error('Seeder Error:', error);
		throw error;
	}
}

// Seed database with high-quality mock products
export async function seedMockProducts() {
	try {
		console.log('\nStarting Product Seeder with Mock Data...\n');

		// Clear existing products
		await Product.deleteMany({});
		console.log('Cleared existing products\n');

		const products = [];

		for (const mock of mockProducts) {
			const { expiryDate, manufacturingDate } = generateExpiryDate(
				mock.category
			);
			const { originalPrice, costPrice } = generatePrice(mock.category);
			const commodityGroup = getCommodityGroup(mock.name, mock.category);

			products.push({
				name: mock.name,
				supplier: mock.supplier,
				ean: mock.ean,
				category: mock.category,
				commodityGroup: mock.commodityGroup || commodityGroup,
				weight: mock.weight || 'N/A',
				manufacturingDate,
				expiryDate,
				originalPrice,
				currentPrice: originalPrice,
				costPrice,
				store: 'Main Store',
				priceStatus: 'pending',
				expiryCount: mock.expiryCount || Math.floor(Math.random() * 3),
			});

			console.log(
				`✅ ${mock.name} (${mock.weight}) → Vgr: ${
					mock.commodityGroup || commodityGroup
				}`
			);
		}

		const inserted = await Product.insertMany(products);

		// Calculate statistics
		const stats = {
			total: inserted.length,
			red: 0,
			orange: 0,
			yellow: 0,
			green: 0,
			categories: {},
		};

		inserted.forEach((product) => {
			const urgency = product.getUrgencyLevel();
			stats[urgency]++;

			if (!stats.categories[product.category]) {
				stats.categories[product.category] = 0;
			}
			stats.categories[product.category]++;
		});

		console.log('\nMock Product Seeder Complete!');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log(`Total products: ${stats.total}`);
		console.log(`🔴 Red (0-1 days): ${stats.red}`);
		console.log(`🟠 Orange (2-3 days): ${stats.orange}`);
		console.log(`🟡 Yellow (4-5 days): ${stats.yellow}`);
		console.log(`🟢 Green (>5 days): ${stats.green}`);
		console.log('\nCategories:');
		Object.entries(stats.categories).forEach(([cat, count]) => {
			console.log(`   ${cat}: ${count}`);
		});
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

		return { success: true, stats };
	} catch (error) {
		console.error('Mock Seeder Error:', error);
		throw error;
	}
}
