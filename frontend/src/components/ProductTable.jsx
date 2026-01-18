import { useState } from 'react';
import ProductTableRow from './ProductTableRow';

const ProductTable = ({ products, onOpenPriceDialog, onResetPrice }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Calculate pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Reset to page 1 when products change
    useState(() => {
        setCurrentPage(1);
    }, [products]);

    return (
        <div>
            {/* Table */}
            <div className="bg-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full min-w-300">
                    <thead className="bg-gray-300">
                        <tr className="border-b-2 border-gray-400">
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Hanterad</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Produktnamn</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Leverantör</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Förpackning</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Avdelning</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Varugrupp</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Utgångsdatum</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Pris</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                    Inga produkter hittades
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((product) => (
                                <ProductTableRow
                                    key={product._id}
                                    product={product}
                                    onOpenPriceDialog={onOpenPriceDialog}
                                    onResetPrice={onResetPrice}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded font-medium ${currentPage === 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-700 text-white hover:bg-green-600 cursor-pointer'
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
                            : 'bg-green-700 text-white hover:bg-green-600 cursor-pointer'
                            }`}
                    >
                        Nästa →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductTable;