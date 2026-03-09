import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, HelpCircle, AlertCircle, Store as StoreIcon, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface MatchedItem {
  product_id: string;
  name: string;
  price: number;
  mrp: number;
  unit: string;
  stock_quantity: number;
  thumbnail?: string;
  brand?: string;
  matched_quantity: number;
  line_total: number;
  status: string;
}

const DraftCart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCartStore();
  
  const { matchedItems = [], unmatchedItems = [], storeId = '' } = location.state || {};
  
  const [perfectMatches, setPerfectMatches] = useState<MatchedItem[]>(
    matchedItems.filter((item: any) => item.status === 'perfect')
  );
  const [adjustedItems, setAdjustedItems] = useState<MatchedItem[]>(
    matchedItems.filter((item: any) => item.status !== 'perfect' && item.status !== 'ambiguous' && item.status !== 'cross_store')
  );
  const [ambiguousItems, setAmbiguousItems] = useState<MatchedItem[]>(
    matchedItems.filter((item: any) => item.status === 'ambiguous')
  );
  const [crossStoreItems, setCrossStoreItems] = useState<MatchedItem[]>(
    matchedItems.filter((item: any) => item.status === 'cross_store' || item.is_cross_store === true)
  );
  const [unresolvedItems] = useState(unmatchedItems);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedAmbiguousItem, setSelectedAmbiguousItem] = useState<any>(null);

  const handleAmbiguousItemClick = (item: any) => {
    setSelectedAmbiguousItem(item);
    setShowSelectionModal(true);
  };

  const handleSelectAlternative = (item: any, alternative: any) => {
    // Move from ambiguous to perfect matches
    const resolvedItem: MatchedItem = {
      product_id: alternative.product_id,
      name: alternative.name,
      price: alternative.price,
      mrp: alternative.mrp || alternative.price,
      unit: alternative.unit || '',
      stock_quantity: alternative.stock_quantity || 100,
      thumbnail: alternative.thumbnail,
      brand: alternative.brand || '',
      matched_quantity: item.matched_quantity || 1,
      line_total: (item.matched_quantity || 1) * alternative.price,
      status: 'perfect',
    };
    
    setPerfectMatches(prev => [...prev, resolvedItem]);
    setAmbiguousItems(prev => prev.filter(i => i.product_id !== item.product_id));
    setShowSelectionModal(false);
    setSelectedAmbiguousItem(null);
    toast.success(`Added: ${alternative.name}`);
  };

  const handleMoveCrossStoreToMatches = (item: any) => {
    // Move from cross-store to perfect matches
    const resolvedItem: MatchedItem = {
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      mrp: item.mrp || item.price,
      unit: item.unit || '',
      stock_quantity: item.stock_quantity || 100,
      thumbnail: item.thumbnail,
      brand: item.brand || '',
      matched_quantity: item.matched_quantity || 1,
      line_total: (item.matched_quantity || 1) * item.price,
      status: 'perfect',
    };
    
    setPerfectMatches(prev => [...prev, resolvedItem]);
    setCrossStoreItems(prev => prev.filter(i => i.product_id !== item.product_id));
    toast.success(`Added: ${item.name}`);
  };

  const totalEstimated = perfectMatches.reduce((sum, item) => sum + item.line_total, 0) +
    adjustedItems.reduce((sum, item) => sum + item.line_total, 0);
  
  const totalItems = perfectMatches.length + adjustedItems.length;

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    try {
      // Add perfect matches
      perfectMatches.forEach(item => {
        addItem({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          mrp: item.mrp,
          unit: item.unit,
          stock_quantity: item.stock_quantity,
          category: '',
          imageUrl: item.thumbnail || '',
          brand: item.brand || '',
        } as any, storeId, item.matched_quantity);
      });

      // Add adjusted items
      adjustedItems.forEach(item => {
        addItem({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          mrp: item.mrp,
          unit: item.unit,
          stock_quantity: item.stock_quantity,
          category: '',
          imageUrl: item.thumbnail || '',
          brand: item.brand || '',
        } as any, storeId, item.matched_quantity);
      });

      toast.success('Items added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add items to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const updateQuantity = (item: MatchedItem, newQty: number, list: 'perfect' | 'adjusted') => {
    if (newQty < 1) return;
    
    const updatedItem = { ...item, matched_quantity: newQty, line_total: item.price * newQty };
    
    if (list === 'perfect') {
      setPerfectMatches(prev => prev.map(i => i.product_id === item.product_id ? updatedItem : i));
    } else {
      setAdjustedItems(prev => prev.map(i => i.product_id === item.product_id ? updatedItem : i));
    }
  };

  const removeItem = (productId: string, list: 'perfect' | 'adjusted') => {
    if (list === 'perfect') {
      setPerfectMatches(prev => prev.filter(i => i.product_id !== productId));
    } else {
      setAdjustedItems(prev => prev.filter(i => i.product_id !== productId));
    }
  };

  return (
    <div className="min-h-screen bg-[#162210] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#162210]/80 backdrop-blur-lg border-b border-primary/10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white tracking-tight">Review Scanned Items</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Unresolved Items */}
        {unresolvedItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-lg font-bold text-white">Needs Your Help</h2>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
              {unresolvedItems.map((item: any, idx: number) => (
                <div key={idx} className="text-sm text-red-400">
                  Could not match: "{item.raw_text}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ambiguous Items */}
        {ambiguousItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-bold text-white">Clarification Needed</h2>
            </div>
            {ambiguousItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAmbiguousItemClick(item)}
                className="w-full bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-3 text-left hover:bg-blue-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-10 h-10 text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-lg mb-2">{item.name}</p>
                    <div className="inline-block px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300 font-semibold">
                      {(item as any).alternatives?.length || 0} options available - Tap to select
                    </div>
                  </div>
                  <div className="text-blue-300 text-2xl">→</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Adjusted Items */}
        {adjustedItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h2 className="text-lg font-bold text-white">Smart Adjustments</h2>
            </div>
            {adjustedItems.map((item, idx) => (
              <div key={idx} className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 mb-3">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-white font-bold">{item.name}</p>
                      <p className="text-[#5bec13] font-bold">₹{item.price}</p>
                    </div>
                    <div className="mt-2 inline-block px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] text-orange-500 font-bold">
                      ADJUSTED
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item, item.matched_quantity - 1, 'adjusted')}
                        className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white"
                      >
                        -
                      </button>
                      <span className="text-[#5bec13] font-bold w-8 text-center">{item.matched_quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, item.matched_quantity + 1, 'adjusted')}
                        className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product_id, 'adjusted')}
                        className="ml-auto text-red-500 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cross-Store Items */}
        {crossStoreItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StoreIcon className="w-6 h-6 text-amber-500" />
              <h2 className="text-lg font-bold text-white">From Other Shops</h2>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-3">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200">
                  These items are not available in your selected shop but were found in other shops.
                </p>
              </div>
            </div>
            {crossStoreItems.map((item: any, idx) => (
              <div key={idx} className="bg-amber-500/5 border border-amber-500/25 rounded-xl p-4 mb-3">
                <div className="flex gap-3">
                  <div className="w-18 h-18 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm mb-1">{item.name}</p>
                    {item.brand && (
                      <p className="text-gray-400 text-xs mb-2">{item.brand}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#5bec13] font-bold text-sm">₹{item.price}</span>
                      {item.unit && (
                        <span className="text-gray-400 text-xs">• {item.unit}</span>
                      )}
                    </div>
                    <div className="inline-block px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] text-amber-500 font-semibold mb-2">
                      📍 From {item.source_store_name || 'Another Shop'}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleMoveCrossStoreToMatches(item)}
                        className="px-4 py-2 bg-[#5bec13] text-black font-bold rounded-lg text-sm flex items-center gap-1"
                      >
                        <span>Add</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Perfect Matches */}
        {perfectMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-[#5bec13]" />
              <h2 className="text-lg font-bold text-white">Perfect Matches ({perfectMatches.length})</h2>
            </div>
            {perfectMatches.map((item, idx) => (
              <div key={idx} className="bg-[#5bec13]/5 border border-[#5bec13]/10 rounded-xl p-3 mb-2">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-white font-semibold text-sm">{item.name}</p>
                      <p className="text-[#5bec13] font-bold text-sm">₹{item.price}</p>
                    </div>
                    {item.unit && (
                      <p className="text-gray-400 text-xs mt-1">• {item.unit}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item, item.matched_quantity - 1, 'perfect')}
                        className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-white text-sm"
                      >
                        -
                      </button>
                      <span className="text-[#5bec13] font-bold text-sm w-6 text-center">{item.matched_quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, item.matched_quantity + 1, 'perfect')}
                        className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-white text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product_id, 'perfect')}
                        className="ml-auto text-red-500 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#162210]/95 backdrop-blur-lg border-t border-[#5bec13]/20 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider">TOTAL ESTIMATED</p>
            <p className="text-2xl font-bold text-white">₹{totalEstimated.toFixed(2)}</p>
          </div>
          <div className="px-2 py-1 bg-[#5bec13]/10 rounded">
            <p className="text-[10px] text-[#5bec13] font-bold">{totalItems} ITEMS READY</p>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={totalItems === 0 || isAddingToCart}
          className="w-full h-14 bg-[#5bec13] text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAddingToCart ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Add {totalItems} Items to Cart</span>
              <ShoppingCart className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Selection Modal for Ambiguous Items */}
      {showSelectionModal && selectedAmbiguousItem && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
          onClick={() => {
            setShowSelectionModal(false);
            setSelectedAmbiguousItem(null);
          }}
        >
          <div 
            className="bg-[#162210] rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#162210] border-b border-[#5bec13]/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select Product</h3>
                <p className="text-sm text-gray-400 italic">
                  For: "{selectedAmbiguousItem.display_name || selectedAmbiguousItem.name}"
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSelectionModal(false);
                  setSelectedAmbiguousItem(null);
                }}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {((selectedAmbiguousItem as any).alternatives || []).length > 0 ? (
                ((selectedAmbiguousItem as any).alternatives || []).map((alt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAlternative(selectedAmbiguousItem, alt)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                        {alt.thumbnail ? (
                          <img src={alt.thumbnail} alt={alt.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-white/50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-1">{alt.name}</p>
                        {alt.brand && (
                          <p className="text-gray-400 text-xs mb-2">{alt.brand}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-[#5bec13] font-bold">₹{alt.price}</span>
                          {alt.unit && (
                            <span className="text-gray-400 text-xs">• {alt.unit}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-[#5bec13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/70 text-sm">No options available</p>
                  <p className="text-white/50 text-xs mt-1">Try manual search from unresolved items</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftCart;
