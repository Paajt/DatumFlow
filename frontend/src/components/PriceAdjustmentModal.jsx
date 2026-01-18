import { useEffect, useState } from 'react';

const PriceAdjustmentModal = ({ product, isOpen, onClose, onConfirm, mode = 'adjust' }) => {
    const [customDiscount, setCustomDiscount] = useState(
        product?.pricing?.discountPercentage || 0
    );
    const [customPrice, setCustomPrice] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Reset state when modal opens or product changes
    useEffect(() => {
        if (isOpen && product) {
            if (mode === 'reset') {
                // Go directly to confirmation
                setShowConfirmation(true);
            } else {
                setCustomDiscount(0) // Start with no discount selected
                setCustomPrice('');
                setShowConfirmation(false);
            }
        }
    }, [isOpen, product, mode]);

    if (!isOpen || !product) return null;

    // Calculate new price based on discount
    const calculateNewPrice = (discount) => {
        return product.originalPrice * (1 - discount / 100);
    };

    // Calculate discount based on custom price
    const calculateDiscountFromPrice = (price) => {
        const discount = ((product.originalPrice - price) / product.originalPrice) * 100;
        return Math.max(0, Math.min(90, discount)); // Clamp between 0-90%
    };

    // For reset mode, use original price
    const newPrice = mode === 'reset'
        ? product.originalPrice
        : customPrice
            ? parseFloat(customPrice)
            : calculateNewPrice(customDiscount);

    const actualDiscount = mode === 'reset'
        ? 0
        : customPrice
            ? calculateDiscountFromPrice(parseFloat(customPrice))
            : customDiscount;

    const savings = product.originalPrice - newPrice;

    // Handle preset discount buttons
    const handlePresetDiscount = (discount) => {
        setCustomDiscount(discount);
        setCustomPrice(''); // Clear custom price when using preset
    };

    // Handle custom price input
    const handleCustomPriceChange = (value) => {
        const price = parseFloat(value);
        if (!isNaN(price) && price >= 0 && price <= product.originalPrice) {
            setCustomPrice(value);
            const discount = calculateDiscountFromPrice(price);
            setCustomDiscount(discount);
        } else if (value === '') {
            setCustomPrice('');
        }
    };

    // Handle confirming the discount
    const handleApplyDiscount = () => {
        setShowConfirmation(true);
    };

    // Handle final confirmation
    const handleFinalConfirm = () => {
        onConfirm(product, actualDiscount, newPrice);
        setShowConfirmation(false);
        setCustomDiscount(0);
        setCustomPrice('');
    };

    // Handle cancel
    const handleCancel = () => {
        setShowConfirmation(false);
        setCustomDiscount(0);
        setCustomPrice('');
        onClose();
    };

    // Handle back from confirmation
    const handleBack = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={handleCancel}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">

                    {!showConfirmation && mode === 'adjust' ? (
                        // Price Adjustment
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Prisförslag
                                </h2>
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                                    {product.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-600">Förp:</span>
                                        <span className="ml-2 font-medium">{product.weight}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Lev:</span>
                                        <span className="ml-2 font-medium">{product.supplier}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">EAN:</span>
                                        <span className="ml-2 font-medium">{product.ean}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Art.nr:</span>
                                        <span className="ml-2 font-medium">{product._id.slice(-7)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Avd:</span>
                                        <span className="ml-2 font-medium">{product.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Vgr:</span>
                                        <span className="ml-2 font-medium">{product.commodityGroup}</span>
                                    </div>

                                    <div>
                                        <span className="text-gray-600">Dagar kvar:</span>
                                        <span className="ml-2 font-medium text-red-600">
                                            {product.pricing.daysUntilExpiry} {product.pricing.daysUntilExpiry === 1 ? 'dag' : 'dagar'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Utg.datum:</span>
                                        <span className="ml-2 font-medium text-red-600">
                                            {new Date(product.expiryDate).toLocaleDateString('sv-SE')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-right"></span>
                                        <span className="ml-2 font-medium"></span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Ordinarie pris:</span>
                                        <span className="ml-2 font-medium">{product.originalPrice.toFixed(2)} kr</span>
                                    </div>
                                </div>
                            </div>

                            {/* Algorithm Suggestion */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                <div className="flex items-start">
                                    <div className="shrink-0">
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                            Systemets rekommendation
                                        </h4>
                                        <p className="text-sm text-blue-800">
                                            Baserat på utgångsdatum ({product.pricing.daysUntilExpiry} dagar kvar)
                                            rekommenderar vi en rabatt på <span className="font-bold">-{product.pricing.discountPercentage}%</span>
                                        </p>
                                        <button
                                            onClick={() => handlePresetDiscount(product.pricing.discountPercentage)}
                                            className="mt-2 text-sm text-blue-700 font-medium hover:text-blue-900 underline cursor-pointer"
                                        >
                                            Använd rekommendation
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Preset Discount Buttons */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                                    Välj förinställd rabatt
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => handlePresetDiscount(15)}
                                        className={`py-4 px-6 rounded-lg font-semibold text-lg transition border-2 ${customDiscount === 15 && !customPrice
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600 cursor-pointer'
                                            }`}
                                    >
                                        -15%
                                    </button>
                                    <button
                                        onClick={() => handlePresetDiscount(25)}
                                        className={`py-4 px-6 rounded-lg font-semibold text-lg transition border-2 ${customDiscount === 25 && !customPrice
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600 cursor-pointer'
                                            }`}
                                    >
                                        -25%
                                    </button>
                                    <button
                                        onClick={() => handlePresetDiscount(50)}
                                        className={`py-4 px-6 rounded-lg font-semibold text-lg transition border-2 ${customDiscount === 50 && !customPrice
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600 cursor-pointer'
                                            }`}
                                    >
                                        -50%
                                    </button>
                                </div>
                            </div>

                            {/* Custom Price Input */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    Eller ange eget pris
                                </label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="number"
                                        min="0.1"
                                        max={product.originalPrice}
                                        step="0.10"
                                        value={customPrice}
                                        onChange={(e) => handleCustomPriceChange(e.target.value)}
                                        placeholder={calculateNewPrice(customDiscount).toFixed(2)}
                                        className="px-4 py-3 border-2 border-gray-300 rounded-lg flex-1 text-lg font-semibold focus:border-blue-500 focus:outline-none"
                                    />
                                    <span className="text-lg font-semibold text-gray-600">kr</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Max: {product.originalPrice.toFixed(2)} kr
                                </p>
                            </div>

                            {/* Price Preview */}
                            <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-6">
                                <h4 className="text-sm font-semibold text-green-900 mb-4">
                                    Prisförhandsvisning
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Ordinarie pris:</span>
                                        <span className="text-lg line-through text-gray-500">
                                            {product.originalPrice.toFixed(2)} kr
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Rabatt:</span>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-red-600">
                                                -{savings.toFixed(2)} kr
                                            </div>
                                            <div className="text-sm text-red-600">
                                                (-{actualDiscount.toFixed(1)}%)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-black">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Nytt pris:</span>
                                            <span className="text-3xl font-bold text-green-700">
                                                {newPrice.toFixed(2)} kr
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-white border-2 border-gray-400 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-semibold transition cursor-pointer"
                                >
                                    Avbryt
                                </button>
                                <button
                                    onClick={handleApplyDiscount}
                                    className="flex-1 bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-600 font-semibold transition shadow-md cursor-pointer"
                                >
                                    Godkänn nytt pris
                                </button>
                            </div>
                        </>
                    ) : (
                        // Confirmation
                        <div className="bg-gray-50 rounded-lg p-6">
                            {/* Product Info */}
                            <div className="mb-2 pb-4">
                                <h2 className="text-2xl font-bold text-gray-900 border-b mb-6 pb-4">
                                    Bekräftelse
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                                        {product.name}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-600">Förp:</span>
                                            <span className="ml-2 font-medium">{product.weight}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Lev:</span>
                                            <span className="ml-2 font-medium">{product.supplier}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">EAN:</span>
                                            <span className="ml-2 font-medium">{product.ean}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Art.nr:</span>
                                            <span className="ml-2 font-medium">{product._id.slice(-7)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Avd:</span>
                                            <span className="ml-2 font-medium">{product.category}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Vgr:</span>
                                            <span className="ml-2 font-medium">{product.commodityGroup}</span>
                                        </div>

                                        <div>
                                            <span className="text-gray-600">Dagar kvar:</span>
                                            <span className="ml-2 font-medium text-red-600">
                                                {product.pricing.daysUntilExpiry} {product.pricing.daysUntilExpiry === 1 ? 'dag' : 'dagar'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Utg.datum:</span>
                                            <span className="ml-2 font-medium text-red-600">
                                                {new Date(product.expiryDate).toLocaleDateString('sv-SE')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Warning Message */}
                            <div className="mb-6">
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                    <p className="text-gray-900 font-semibold mb-2">
                                        OBS!
                                    </p>

                                    <p className="text-gray-800 mb-3">
                                        {mode === 'reset' ? (
                                            <>
                                                Genom att fortsätta kommer <span className="font-semibold">{product.name}</span> återställas till ordinarie pris <span className="font-bold text-black">{product.originalPrice.toFixed(2)} kr</span>.
                                            </>
                                        ) : (
                                            <>
                                                Genom att fortsätta kommer <span className="font-semibold">{product.name}</span> få en rabatt på <span className="font-bold text-red-700">-{actualDiscount.toFixed(1)}%</span>.
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 space-y-2">
                                    {mode === 'reset' ? (
                                        // Reset mode - show current discounted price vs original
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Nuvarande pris:</span>
                                                <span className="line-through text-red-700">{product.currentPrice.toFixed(2)} kr</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-black">
                                                <span className="font-semibold text-gray-900">Ordinarie pris:</span>
                                                <span className="font-bold text-xl text-black-700">{product.originalPrice.toFixed(2)} kr</span>
                                            </div>
                                        </>
                                    ) : (
                                        // Adjust mode - show discount calculation
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ordinarie pris:</span>
                                                <span className="line-through text-gray-500">{product.originalPrice.toFixed(2)} kr</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Rabatt:</span>
                                                <span className="text-red-600 font-semibold">-{savings.toFixed(2)} kr (-{actualDiscount.toFixed(1)}%)</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-black">
                                                <span className="font-semibold text-gray-900">Nytt pris:</span>
                                                <span className="font-bold text-xl text-green-700">{newPrice.toFixed(2)} kr</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Confirmation Question */}
                            <p className="text-center text-gray-900 font-semibold mb-6">
                                Vill du fortsätta?
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                {mode === 'adjust' && (
                                    <button
                                        onClick={handleBack}
                                        className="flex-1 bg-white border-2 border-gray-400 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-semibold transition cursor-pointer"
                                    >
                                        Tillbaka
                                    </button>
                                )}
                                {mode === 'reset' && (
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-white border-2 border-gray-400 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 font-semibold transition cursor-pointer"
                                    >
                                        Avbryt
                                    </button>
                                )}
                                <button
                                    onClick={handleFinalConfirm}
                                    className="flex-1 bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-600 font-semibold transition shadow-md cursor-pointer"
                                >
                                    Ja, bekräfta
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PriceAdjustmentModal;