import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Get all products with pricing
export const getProducts = async () => {
	const response = await api.get('/products');
	return response.data;
};

// Update price
export const updateProductPrice = async (
	productId,
	newPrice,
	staffMember = 'Butikspersonal'
) => {
	const response = await api.put(`/products/${productId}/price`, {
		newPrice,
		staffMember,
	});
	return response.data;
};

// Reset price
export const resetProductPrice = async (
	productId,
	staffMember = 'Butikspersonal'
) => {
	const response = await api.put(`/products/${productId}/reset-price`, {
		staffMember,
	});
	return response.data;
};

export default api;
