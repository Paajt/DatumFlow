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
    return <div className="p-8">Laddar...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text 3-xl font-bold mb-4">DatumFlow</h1>
      <p>Antal produkter: {products.length}</p>
    </div>
  );
}

export default App;
