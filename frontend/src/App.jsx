import { useEffect, useState } from "react";
import { getProducts } from "./services/api";
import StatsCard from "./components/StatsCard";

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
          <StatsCard
            urgency="red"
            count={stats?.red || 0}
            label="Brådskande (0-1 dagar)"
          />
          <StatsCard
            urgency="orange"
            count={stats?.orange || 0}
            label="Varning (2-3 dagar)"
          />
          <StatsCard
            urgency="yellow"
            count={stats?.yellow || 0}
            label="Snart (4-5 dagar)"
          />
          <StatsCard
            urgency="green"
            count={stats?.green || 0}
            label="OK (>5 dagar)"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
