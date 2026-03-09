import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store as StoreIcon, Search, MapPin, Star, FileText } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/common/Loading';
import CartBottomBar from '../components/CartBottomBar';
import { productsService } from '../services/products';
import { storeService } from '../services/stores';
import { Product, Store as StoreType } from '../types';
import toast from 'react-hot-toast';

const Store: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [isDelivery, setIsDelivery] = useState(true);

  useEffect(() => {
    if (storeId) {
      loadStoreAndProducts();
    }
  }, [storeId]);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products]);

  const loadStoreAndProducts = async () => {
    setIsLoading(true);
    try {
      // Load store details
      try {
        const storeData = await storeService.getStoreDetails(storeId!);
        setStore(storeData);
      } catch (e) {
        console.log('Could not load store details');
      }

      // Load products
      const data = await productsService.getProductsByStore(storeId!);
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'All Items') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory));
    }
  };

  const categories = ['All Items', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-2 pb-0">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6 text-textPrimary" />
          </button>
          <StoreIcon className="w-5 h-5 text-primary flex-shrink-0" />
          <h1 className="text-lg font-bold text-textPrimary truncate ml-2">
            {store?.name || 'Store'}
          </h1>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
        >
          <Search className="w-5 h-5 text-textPrimary" />
        </button>
      </div>

      {/* Delivery / Takeaway Toggle */}
      <div className="px-4 pt-3">
        <div className="h-11 bg-surface border border-border rounded-xl flex overflow-hidden">
          <button
            onClick={() => setIsDelivery(true)}
            className={`flex-1 flex items-center justify-center text-sm transition-all rounded-xl ${
              isDelivery
                ? 'bg-surfaceVariant font-semibold text-textPrimary'
                : 'text-textSecondary'
            }`}
          >
            Delivery
          </button>
          <button
            onClick={() => setIsDelivery(false)}
            className={`flex-1 flex items-center justify-center text-sm transition-all rounded-xl ${
              !isDelivery
                ? 'bg-surfaceVariant font-semibold text-textPrimary'
                : 'text-textSecondary'
            }`}
          >
            Takeaway
          </button>
        </div>
      </div>

      {/* Store Info */}
      {store && (
        <div className="px-4 pt-3 flex items-center gap-2 text-sm text-textTertiary">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate flex-1">
            {store.distance?.toFixed(1) || '--'} km away • {store.address}
          </span>
          {store.rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-textSecondary">
                {store.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Category Pills */}
      <div className="pt-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4">
          {categories.map((cat) => {
            const isSelected = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium text-[13px] whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-primary text-buttonText font-semibold'
                    : 'bg-surface border border-border text-textSecondary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-base font-bold text-textPrimary">
          {selectedCategory === 'All Items' ? 'Featured Products' : selectedCategory}
        </h2>
        {selectedCategory === 'All Items' && (
          <span className="text-xs font-bold text-primary tracking-wider">SEE ALL</span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="w-12 h-12 text-textTertiary mb-3" />
          <p className="text-sm text-textSecondary">No products found</p>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} storeId={storeId} />
          ))}
        </div>
      )}

      {/* AI Assistant Banner */}
      <div className="px-4 pt-4 pb-4">
        <button
          onClick={() => navigate('/ai-scanner')}
          className="w-full bg-surface border border-border rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="flex-1 text-left">
            <p className="text-[11px] font-bold text-primary tracking-wider mb-1">
              AI ASSISTANT
            </p>
            <p className="text-[15px] font-bold text-textPrimary mb-1">
              Have a handwritten list?
            </p>
            <p className="text-xs text-textTertiary">
              Scan it instantly to add items to cart.
            </p>
          </div>
          <FileText className="w-10 h-10 text-textTertiary flex-shrink-0" />
        </button>
      </div>

      {/* Cart Bottom Bar */}
      <CartBottomBar />
    </div>
  );
};

export default Store;
