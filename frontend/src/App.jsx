import { useEffect, useState } from "react";
import { getProducts } from "./services/api";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      setError('Kunde inte hämta produkter: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">Laddar...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text 3-xl font-bold text-gray-900 mb-4">DatumFlow</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-lg font-semibold">Antal produkter: {products.length}</p>
      </div>

      {/* Product list */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Produkter</h2>
        <div className="space-y-2">
          {products.slice(0, 10).map((product) => (
            <div key={product.id} className="p-3 border rounded hover:bg-gray-50">
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-600">
                {product.supplier} - {product.category}
              </div>
            </div>
          ))}
        </div>
        {products.length > 10 && (
          <p className="text-sm text-gray-500 mt-4">
            Visar 10 av {products.length} produkter
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
