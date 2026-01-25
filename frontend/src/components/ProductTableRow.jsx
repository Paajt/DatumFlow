const ProductTableRow = ({ product, onOpenPriceDialog, onResetPrice }) => {
    // Get status color
    const getStatusColor = (urgencyLevel) => {
        const colors = {
            red: 'bg-red-500',
            orange: 'bg-orange-500',
            yellow: 'bg-yellow-400',
            green: 'bg-green-500',
        };
        return colors[urgencyLevel] || 'bg-gray-300';
    };

    // Calculate discount percentage
    const discountPercentage = product.priceStatus === 'handled'
        ? ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
        : product.pricing.discountPercentage;

    const suggestedPrice = product.priceStatus === 'handled'
        ? product.currentPrice
        : product.originalPrice * (1 - product.pricing.discountPercentage / 100);

    return (
        <tr className="border-b border-gray-300 hover:bg-gray-100">
            {/* Status Circle */}
            <td className="px-4 py-4">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(product.pricing.urgencyLevel)}`} />
            </td>

            {/* Handled Checkbox */}
            <td className="px-4 py-4">
                <input
                    type="checkbox"
                    checked={product.priceStatus === 'handled'}
                    readOnly
                    className="w-4 h-4 cursor-not-allowed"
                />
            </td>

            {/* Product Name */}
            <td className="px-4 py-4">
                <div className="font-medium text-gray-900">{product.name}</div>
            </td>

            {/* Supplier */}
            <td className="px-4 py-4 text-gray-700">{product.supplier}</td>

            {/* Weight/Package */}
            <td className="px-4 py-4 text-gray-700">{product.weight}</td>

            {/* Category */}
            <td className="px-4 py-4 text-gray-700">{product.category}</td>

            {/* Commodity Group */}
            <td className="px-4 py-4 text-gray-700">{product.commodityGroup}</td>

            {/* Expiry Date */}
            <td className="px-4 py-4">
                <div className={`font-medium ${product.pricing.urgencyLevel === 'red' ? 'text-red-600' :
                    product.pricing.urgencyLevel === 'orange' ? 'text-orange-600' :
                        'text-gray-700'
                    }`}>
                    {new Date(product.expiryDate).toLocaleDateString('sv-SE')}
                </div>
            </td>

            {/* Price Column */}
            <td className="px-4 py-4">
                {product.priceStatus === 'handled' ? (
                    // Handled product - show discounted price
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Rabatterat pris: <span className="font-bold text-red-600">{product.currentPrice.toFixed(2)} kr</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => onOpenPriceDialog(product)}
                                className="px-1 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 cursor-pointer text-sm"
                            >
                                Ändra rabatt
                            </button>
                            <button
                                onClick={() => onResetPrice(product)}
                                className="px-1 py-2 bg-gray-600 text-white rounded font-medium hover:bg-gray-700 cursor-pointer text-sm"
                            >
                                Återställ pris
                            </button>
                        </div>
                    </div>
                ) : (
                    // Pending product - show suggestion
                    <div className="space-y-1">
                        <div className="text-sm">
                            <span className="text-gray-600">Ord.pris: </span>
                            <span className="font-medium">{product.originalPrice.toFixed(2)} kr</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600">Prisförslag: </span>
                            <span className="font-bold text-red-600">
                                {suggestedPrice.toFixed(2)} kr (-{discountPercentage.toFixed(0)}%)
                            </span>
                        </div>
                        <button
                            onClick={() => onOpenPriceDialog(product)}
                            className="w-full px-3 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-600 cursor-pointer"
                        >
                            Öppna prisförslag
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default ProductTableRow;