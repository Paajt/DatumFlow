const ProductCard = ({
    product,
    onOpenPriceDialog,
    onViewDetails,
    variant = 'urgent', // urgent or frequent
    onMarkAsHandled, // for urgent
    onAnalyze,  // for frequent
    onRemoveFromList // for frequent
}) => {
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
                            {variant === 'urgent' ? (
                                <>
                                    <span className={`inline-block w-3 h-3 rounded-full ${product.pricing.urgencyLevel === 'red' ? 'bg-red-500' :
                                        product.pricing.urgencyLevel === 'orange' ? 'bg-orange-500' :
                                            product.pricing.urgencyLevel === 'yellow' ? 'bg-yellow-500' :
                                                'bg-green-500'
                                        }`}></span>
                                    <p className="text-xs font-semibold">
                                        Utgångsdatum: {new Date(product.expiryDate).toLocaleDateString('sv-SE')}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-semibold">
                                        {product.expiryCount} {product.expiryCount === 1 ? 'åtgärd' : 'åtgärder'} (senaste 30-dagar)
                                    </p>
                                </>
                            )}
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
                {variant === 'urgent' ? (
                    <>
                        <p className="text-sm">
                            <span className="font-semibold">Ord.pris:</span> {product.originalPrice.toFixed(2)} kr
                        </p>
                        <p className="text-sm text-red-600 font-bold">
                            Prisförslag: {product.pricing.suggestedPrice.toFixed(2)} kr (-{product.pricing.discountPercentage}%)
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm">
                            <span className="font-semibold">Ord.pris:</span> {product.originalPrice.toFixed(2)} kr
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold text-red-600">Senast ändrad: {new Date().toLocaleDateString('sv-SE')}</span>
                        </p>
                    </>
                )}
            </div>

            {/* Action Buttons, different variants */}
            <div className="space-y-2">
                {variant === 'urgent' ? (
                    // Buttons for urgent products
                    <>
                        <button
                            onClick={() => onOpenPriceDialog(product)}
                            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600 text-sm font-medium cursor-pointer"
                        >
                            Öppna prisförslag
                        </button>
                        <button
                            onClick={() => onViewDetails(product)}
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm cursor-pointer"
                        >
                            Produktöversikt
                        </button>
                        <button
                            onClick={() => onMarkAsHandled(product)}
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm cursor-pointer">
                            Markera som hanterad
                        </button>
                    </>
                ) : (
                    // Buttons for frequent products
                    <>
                        <button
                            onClick={() => onAnalyze && onAnalyze(product)}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 text-sm font-medium cursor-pointer"
                        >
                            Analysera
                        </button>
                        <button
                            onClick={() => onViewDetails && onViewDetails(product)}
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 text-sm cursor-pointer"
                        >
                            Produktöversikt
                        </button>
                        <button
                            onClick={() => onRemoveFromList && onRemoveFromList(product)}
                            className="w-full bg-white border border-red-300 text-red-700 py-2 rounded hover: text-sm cursor-pointer"
                        >
                            Ta bort från listan
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductCard;