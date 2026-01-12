import { useEffect, useState } from "react";
import { getProducts } from "./services/api";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setStats(data.stats);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">DatumFlow</h1>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Översikt</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Brådskande (0-1 dagar)</p>
            <p className="text-3xl font-bold text-red-600">{stats?.red || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Varning (2-3 dagar)</p>
            <p className="text-3xl font-bold text-orange-600">{stats?.orange || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Snart (4-5 dagar)</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.yellow || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">OK</p>
            <p className="text-2xl font-bold text-green-600">{stats?.green || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
