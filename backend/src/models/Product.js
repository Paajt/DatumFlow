import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		supplier: {
			type: String,
			required: true,
			trim: true,
		},
		ean: {
			type: String,
			required: true,
			unique: true,
			true: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		manufacturingDate: {
			type: Date,
			required: true,
		},
		expiryDate: {
			type: Date,
			required: true,
		},
		originalPrice: {
			type: Number,
			required: true,
			min: 0,
		},
		currentPrice: {
			type: Number,
			required: true,
			min: 0,
		},
		costPrice: {
			type: Number,
			min: 0,
		},
		store: {
			type: String,
			default: 'Main Store',
		},
		priceStatus: {
			type: String,
			enum: ['pending', 'handled', 'sold', 'expired'],
			default: 'pending',
		},
		handledAt: {
			type: Date,
		},
		handledBy: {
			type: String,
		},
		expiryCount: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

/* Utility methods that belong to the model */
// Calculate days until expiry
productSchema.methods.getDaysUntilExpiry = function () {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const expiry = new Date(this.expiryDate);
	expiry.setHours(0, 0, 0, 0);

	const diffTime = expiry - today;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
};

// Get urgency level based on color coding
// Red: 0-1 days, Orange: 2-3 days, Yellow: 4-5 days, Green: >5 days
productSchema.methods.getUrgencyLevel = function () {
	const days = this.getDaysUntilExpiry();

	if (days <= 1) return 'red';
	if (days <= 3) return 'orange';
	if (days <= 5) return 'yellow';
	return 'green';
};

// Mark product as handled
productSchema.methods.markAsHandled = function (staffMember) {
	this.priceStatus = 'handled';
	this.handledAt = new Date();
	this.handledBy = staffMember || 'Unknown';
	return this.save();
};

// Increment expiry count
productSchema.methods.incrementExpiryCount = function () {
	this.expiryCount += 1;
	return this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;
