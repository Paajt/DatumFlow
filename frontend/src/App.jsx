import { useState, useEffect } from 'react';
import { getProducts, updateProductPrice, resetProductPrice } from './services/api';
import Header from './components/Header';
import datumFlowLogo from './assets/images/datumflow-logo.svg';
import StatsCard from './components/StatsCard';
import UrgentProductList from './components/UrgentProductList';
import FrequentProductsList from './components/FrequentProductList';
import PriceAdjustmentModal from './components/PriceAdjustmentModal';
import Toast from './components/Toast';
import ProductsTab from './components/ProductsTab';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('start');
  const [products, setProducts] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('adjust');

  // Toast state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data.products)
    } catch (error) {
      setError('Kunde inte hämta produkter: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show how many number of products in each StatsCard
  const calculateStats = (products) => {
    return {
      red: products.filter(p => p.pricing.urgencyLevel === 'red' && p.priceStatus === 'pending').length,
      orange: products.filter(p => p.pricing.urgencyLevel === 'orange' && p.priceStatus === 'pending').length,
      yellow: products.filter(p => p.pricing.urgencyLevel === 'yellow' && p.priceStatus === 'pending').length,
      green: products.filter(p => p.pricing.urgencyLevel === 'green' && p.priceStatus === 'pending').length,
    };
  };

  // Handle opening price dialog
  const handleOpenPriceDialog = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setModalMode('adjust');
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle confirming discount
  const handleConfirmDiscount = async (product, discount, newPrice) => {
    try {
      if (modalMode === 'reset') {
        // Reset price to original
        await resetProductPrice(product._id, 'Butikspersonal');

        setToast({
          message: `Pris återställt för ${product.name}!`,
          type: 'info',
        });

      } else {
        // Adjust price
        console.log('Updating product price:', {
          product: product.name,
          discount: discount.toFixed(0) + '%',
          newPrice: newPrice.toFixed(2) + ' kr',
        });

        // Call API to update price
        await updateProductPrice(product._id, newPrice, 'Butikspersonal');

        // Show success toast
        setToast({
          message: `Pris uppdaterat för ${product.name}!`,
          type: 'success',
        });
      }

      // Close modal
      handleCloseModal();

      // Refresh products list
      await fetchProducts();

    } catch (error) {
      console.error('Error updating price:', error);
      setToast({
        message: 'Kunde inte uppdatera pris. Försök igen.',
        type: 'error',
      });
    }
  };

  // Handle resetting product price to original
  const handleResetPrice = (product) => {
    // Open modal in reset mode for confirmation
    setSelectedProduct(product);
    setModalMode('reset');
    setIsModalOpen(true);
  };

  // Close toast
  const handleCloseToast = () => {
    setToast(null);
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

  const urgentProducts = products.filter((p) => p.pricing.urgencyLevel === 'red' && p.priceStatus === 'pending');

  const frequentProducts = products.filter((p) => p.expiryCount > 0).sort((a, b) => b.expiryCount - a.expiryCount);

  const currentStats = calculateStats(products);

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
              className={`px-8 py-4 font-semibold cursor-pointer hover:text-black ${activeTab === 'start'
                ? 'border-b-4 border-black'
                : 'text-gray-600'
                }`}
            >
              Start
            </button>
            <button
              onClick={() => setActiveTab('produkter')}
              className={`px-8 py-4 font-semibold cursor-pointer hover:text-black ${activeTab === 'produkter'
                ? 'border-b-4 border-black'
                : 'text-gray-600'
                }`}
            >
              Produkter
            </button>
            <button
              onClick={() => setActiveTab('statistik')}
              className={`px-8 py-4 font-semibold cursor-pointer hover:text-black ${activeTab === 'statistik'
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
                    count={currentStats.red}
                    label="Brådskande"
                  />
                  <StatsCard
                    urgency="orange"
                    count={currentStats.orange}
                    label="Varning"
                  />
                  <StatsCard
                    urgency="yellow"
                    count={currentStats.yellow}
                    label="Snart"
                  />
                  <StatsCard
                    urgency="green"
                    count={currentStats.green}
                    label="OK"
                  />
                </div>

                {/* Two Column Layout for Product Lists */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Brådskande produkter */}

                  <UrgentProductList
                    products={urgentProducts}
                    onOpenPriceDialog={handleOpenPriceDialog}
                    onViewDetails={(p) => console.log('View details:', p.name)}
                  />

                  {/* Right: Produkter som åtgärdas ofta */}
                  <FrequentProductsList
                    products={frequentProducts}
                    onOpenPriceDialog={(p) => console.log('Open price dialog:', p.name)}
                    onViewDetails={(p) => console.log('View details:', p.name)}
                  />

                </div>
              </>
            )}

            {activeTab === 'produkter' && (
              <ProductsTab
                products={products}
                onOpenPriceDialog={handleOpenPriceDialog}
                onResetPrice={handleResetPrice}
              />
            )}

            {activeTab === 'statistik' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Statistik kommer här...</p>
              </div>
            )}
          </div>
        </div>
      </div >
      <PriceAdjustmentModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDiscount}
        mode={modalMode}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}

export default App;