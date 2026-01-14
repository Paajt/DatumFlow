import { useState } from 'react';
import ProductCard from './ProductCard';

const FrequentProductsList = ({ products, onOpenPriceDialog, onViewDetails }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 2;

    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
                Produkter som åtgärdas ofta
            </h3>

            {/* Product Cards */}
            {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    Inga produkter som ofta åtgärdas just nu!
                </p>
            ) : (
                <>
                    <div className="space-y-4">
                        {currentProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onOpenPriceDialog={onOpenPriceDialog}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded font-medium ${currentPage === 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-purple-500 text-white hover:bg-purple-600'
                                    }`}
                            >
                                ← Föregående
                            </button>

                            <p className="text-sm text-gray-600">
                                Sida {currentPage} av {totalPages} ({products.length} produkter)
                            </p>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded font-medium ${currentPage === totalPages
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-purple-500 text-white hover:bg-purple-600'
                                    }`}
                            >
                                Nästa →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FrequentProductsList;