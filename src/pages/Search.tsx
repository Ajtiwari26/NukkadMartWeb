import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X, Store as StoreIcon, MapPin, ShoppingBag, Plus, Check } from 'lucide-react';
import { productsService } from '../services/products';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface SearchResult {
  product: Product;
  store_id: string;
  store_name: string;
  distance: number;
}

const DEMO_STORES = [
  { id: 'DEMO_STORE_1', name: 'TestShop 1', distance: 0.5 },
  { id: 'DEMO_STORE_2', name: 'TestShop 2', distance: 1.2 },
  { id: 'DEMO_STORE_3', name: 'TestShop 3', distance: 2.0 },
];

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useAuthStore();
  const { addItem, getItemQuantity } = useCartStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const performSearch = async (q: string) => {
    setIsSearching(true);
    try {
      const stores = isDemoMode
        ? DEMO_STORES
        : DEMO_STORES; // In production, use real stores

      const allResults: SearchResult[] = [];

      for (const store of stores) {
        try {
          const products = await productsService.searchProducts(store.id, q);
          for (const product of products) {
            allResults.push({
              product,
              store_id: store.id,
              store_name: store.name,
              distance: store.distance,
            });
          }
        } catch (e) {
          console.error(`Error searching store ${store.id}:`, e);
        }
      }

      // Sort by distance then price
      allResults.sort((a, b) => {
        const distCompare = a.distance - b.distance;
        if (distCompare !== 0) return distCompare;
        return a.product.price - b.product.price;
      });

      setResults(allResults);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCart = (result: SearchResult) => {
    addItem(result.product, result.store_id, 1);
    toast.success(`${result.product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-surface border-b border-border p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6 text-textPrimary" />
          </button>
          <div className="flex-1 h-12 bg-surfaceVariant border border-border rounded-xl flex items-center px-3 gap-2">
            <SearchIcon className="w-5 h-5 text-textSecondary flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all nearby shops..."
              className="flex-1 bg-transparent text-textPrimary text-[15px] placeholder-textTertiary outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="flex-shrink-0"
              >
                <X className="w-5 h-5 text-textSecondary" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        {isSearching ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !query.trim() ? (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchIcon className="w-16 h-16 text-textTertiary/30 mb-4" />
            <h2 className="text-lg font-bold text-textSecondary mb-2">
              Search for products
            </h2>
            <p className="text-sm text-textTertiary">
              Find items across all nearby shops
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchIcon className="w-16 h-16 text-textTertiary/30 mb-4" />
            <h2 className="text-lg font-bold text-textSecondary mb-2">
              No results found
            </h2>
            <p className="text-sm text-textTertiary">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {results.map((result, index) => {
              const isInCart = getItemQuantity(result.product.product_id) > 0;
              return (
                <div
                  key={`${result.store_id}-${result.product.product_id}-${index}`}
                  className="bg-surface border border-border rounded-xl p-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Store badge */}
                    <div className="flex flex-col items-start gap-1.5">
                      <div className="bg-primary/10 rounded-md px-2 py-1 flex items-center gap-1">
                        <StoreIcon className="w-3 h-3 text-primary" />
                        <span className="text-[11px] font-bold text-primary">
                          {result.store_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-textTertiary" />
                        <span className="text-[11px] text-textTertiary">
                          {result.distance.toFixed(1)} km
                        </span>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="w-[60px] h-[60px] bg-surfaceVariant rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {result.product.image_url ? (
                        <img
                          src={result.product.image_url}
                          alt={result.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-textTertiary" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-textPrimary line-clamp-2">
                        {result.product.name}
                      </p>
                      {result.product.brand && (
                        <p className="text-[11px] text-textTertiary mt-0.5">
                          {result.product.brand}
                        </p>
                      )}
                      <div className="flex items-baseline gap-1 mt-1.5">
                        <span className="text-base font-bold text-primary">
                          ₹{result.product.price.toFixed(0)}
                        </span>
                        {result.product.unit && (
                          <span className="text-[11px] text-textTertiary">
                            / {result.product.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => !isInCart && handleAddToCart(result)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isInCart
                          ? 'bg-success/20'
                          : 'bg-primary'
                      }`}
                    >
                      {isInCart ? (
                        <Check className="w-5 h-5 text-success" />
                      ) : (
                        <Plus className="w-5 h-5 text-buttonText" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
