import { useState, useEffect } from 'react';
import { getProducts } from './services/api';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import datumFlowLogo from './assets/images/datumflow-logo.svg';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('start');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setStats(data.stats);
      setProducts(data.products)
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

  const urgentProducts = products.filter((p) => p.pricing.urgencyLevel === 'red');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - ICA Style */}
      <Header />

      {/* DatumFlow Section */}
      < div className="max-w-7xl mx-auto p-4" >
        <div className="flex items-center gap-2 mb-4">

          <button className="bg-green-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2">
            <img src={datumFlowLogo} alt="DatumFlow logo" className='w-8 h-7' />
            DatumFlow
          </button>
          <button className="bg-gray-400 text-white w-10 h-10 rounded-full">
            ?
          </button>
        </div>

        {/* Main Content Container */}
        <div className="bg-white border-4 border-green-700 rounded-4xl">
          {/* Navigation Tabs */}
          <div className="border-b-2 border-gray-200 flex justify-center">
            <button
              onClick={() => setActiveTab('start')}
              className={`px-8 py-4 font-semibold ${activeTab === 'start'
                ? 'border-b-4 border-black'
                : 'text-gray-600'
                }`}
            >
              Start
            </button>
            <button
              onClick={() => setActiveTab('produkter')}
              className={`px-8 py-4 font-semibold ${activeTab === 'produkter'
                ? 'border-b-4 border-black'
                : 'text-gray-600'
                }`}
            >
              Produkter
            </button>
            <button
              onClick={() => setActiveTab('statistik')}
              className={`px-8 py-4 font-semibold ${activeTab === 'statistik'
                ? 'border-b-4 border-black'
                : 'text-gray-600'
                }`}
            >
              Statistik
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'start' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <StatsCard
                    urgency="red"
                    count={stats?.red || 0}
                    label="Brådskande"
                  />
                  <StatsCard
                    urgency="orange"
                    count={stats?.orange || 0}
                    label="Varning"
                  />
                  <StatsCard
                    urgency="yellow"
                    count={stats?.yellow || 0}
                    label="Snart"
                  />
                  <StatsCard
                    urgency="green"
                    count={stats?.green || 0}
                    label="OK"
                  />
                </div>

                {/* Two Column Layout for Product Lists */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Brådskande produkter */}
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Brådskande, åtgärder behövs (0-1 dag)
                    </h3>
                    {/* Show urgent products here */}
                    <div className='space-y-4'>
                      {urgentProducts.slice(0, 2).map((product) => (
                        <div key={product._id} className="bg-white p-4 rounded">
                          <p className='font-semibold'>{product.name}</p>
                          <p className='text-sm text-gray-600'>{product.supplier}</p>
                        </div>
                      ))}
                    </div>

                    <p className='text-sm text-gray-500 mt-4 text-center'>
                      Sida 1 av {Math.ceil(urgentProducts.length / 2)}
                    </p>
                  </div>

                  {/* Right: Produkter som åtgärdas ofta */}
                  <div className="bg-purple-100 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Produkter som åtgärdas ofta
                    </h3>
                    <p className="text-gray-500">Produkter kommer här...</p>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Sida 1 av 1
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'produkter' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Produktlista kommer här...</p>
              </div>
            )}

            {activeTab === 'statistik' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Statistik kommer här...</p>
              </div>
            )}
          </div>
        </div>
      </div >
    </div >
  );
}

export default App;