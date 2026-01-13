const ProductCard = ({ product, onOpenPriceDialog, onViewDetails }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow">
            {/* Product Info */}
            <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <p className="font-semibold text-sm">Art: {product.name}</p>
                        <p className="text-xs text-gray-600">Förp: {product.weight || 'N/A'}</p>
                        <p className="text-xs text-gray-600">Lev: {product.supplier}</p>
                        <p className="text-xs text-gray-600">EAN: {product.ean}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1">
                            <span className={`inline-block w-3 h-3 rounded-full ${product.pricing.urgencyLevel === 'red' ? 'bg-red-500' :
                                product.pricing.urgencyLevel === 'orange' ? 'bg-orange-500' :
                                    product.pricing.urgencyLevel === 'yellow' ? 'bg-yellow-500' :
                                        'bg-green-500'
                                }`}></span>
                            <p className="text-xs font-semibold">
                                Utgångsdatum: {new Date(product.expiryDate).toLocaleDateString('sv-SE')}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-600">Art.nr: {product._id.slice(-7)}</p>
                <p className="text-xs text-gray-600">Avd: {product.category}</p>
                <p className="text-xs text-gray-600">Vgr: {product.commodityGroup || '999'}</p>
                <p className="text-xs text-gray-600">Ink.pris: {product.costPrice.toFixed(2)} kr</p>
            </div>

            {/* Price Info */}
            <div className="mb-3">
                <p className="text-sm">
                    <span className="font-semibold">Ord.pris:</span> {product.originalPrice.toFixed(2)} kr
                </p>
                <p className="text-sm text-red-600 font-bold">
                    Prisförslag: {product.pricing.suggestedPrice.toFixed(2)} kr (-{product.pricing.discountPercentage}%)
                </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
                <button
                    onClick={() => onOpenPriceDialog(product)}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm font-medium"
                >
                    Öppna prisförslag
                </button>
                <button
                    onClick={() => onViewDetails(product)}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm"
                >
                    Produktöversikt
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm">
                    Markera som hanterad
                </button>
            </div>
        </div>
    );
};

export default ProductCard;