import { useState, useMemo } from 'react';
import ProductTable from './ProductTable';

const ProductsTab = ({ products, onOpenPriceDialog, onResetPrice }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, red, orange, yellow, green
    const [sortBy, setSortBy] = useState('expiryDate'); // expiryDate, price, category
    const [showHandled, setShowHandled] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.ean.includes(query) ||
                p.supplier.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.pricing.urgencyLevel === statusFilter);
        }

        // Handled filter
        if (!showHandled) {
            filtered = filtered.filter(p => p.priceStatus === 'pending');
        }

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'expiryDate':
                    return new Date(a.expiryDate) - new Date(b.expiryDate);
                case 'price':
                    return a.currentPrice - b.currentPrice;
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [products, searchQuery, statusFilter, sortBy, showHandled]);

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setSortBy('expiryDate');
        setShowHandled(true);
    };

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || sortBy !== 'expiryDate' || !showHandled;

    return (
        <div>
            {/* Toolbar */}
            <div className="mb-6 flex items-center gap-4">
                {/* Filter Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${showFilters ? 'bg-green-700 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                >
                    ☰ Filtrera
                </button>

                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium bg-white cursor-pointer"
                >
                    <option value="expiryDate">Sortera på: Utgångsdatum</option>
                    <option value="price">Sortera på: Pris</option>
                    <option value="category">Sortera på: Avdelning</option>
                </select>

                {/* Reset Filter Button */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 flex items-center gap-2"
                    >
                        ⊗ Nollställ filter
                    </button>
                )}

                {/* Search Input */}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Sök</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Produktnamn, EAN, leverantör..."
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg w-80 focus:border-green-700 focus:outline-none"
                    />
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mb-6 bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Filtrera på status
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-4 py-2 rounded font-medium ${statusFilter === 'all'
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Alla
                                </button>
                                <button
                                    onClick={() => setStatusFilter('red')}
                                    className={`px-4 py-2 rounded font-medium ${statusFilter === 'red'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    🔴 Röd
                                </button>
                                <button
                                    onClick={() => setStatusFilter('orange')}
                                    className={`px-4 py-2 rounded font-medium ${statusFilter === 'orange'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    🟠 Orange
                                </button>
                                <button
                                    onClick={() => setStatusFilter('yellow')}
                                    className={`px-4 py-2 rounded font-medium ${statusFilter === 'yellow'
                                        ? 'bg-yellow-400 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    🟡 Gul
                                </button>
                                <button
                                    onClick={() => setStatusFilter('green')}
                                    className={`px-4 py-2 rounded font-medium ${statusFilter === 'green'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    🟢 Grön
                                </button>
                            </div>
                        </div>

                        {/* Show Handled Toggle */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Visa hanterade produkter
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showHandled}
                                    onChange={(e) => setShowHandled(e.target.checked)}
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <span className="text-gray-700">Inkludera produkter med rabatterat pris</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
                Visar {filteredProducts.length} av {products.length} produkter
            </div>

            {/* Product Table */}
            <ProductTable
                products={filteredProducts}
                onOpenPriceDialog={onOpenPriceDialog}
                onResetPrice={onResetPrice}
            />
        </div>
    );
};

export default ProductsTab;