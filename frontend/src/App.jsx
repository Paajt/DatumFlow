import { useEffect, useState } from "react";
import { getProducts } from "./services/api";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text 3-xl font-bold text-gray-900 mb-4">DatumFlow</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Antal produkter: {products.length}</p>
      </div>
    </div>
  );
}

export default App;
