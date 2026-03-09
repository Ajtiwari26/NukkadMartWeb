import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShoppingCart, Mic, Volume2, Loader2, BarChart3,
  Store as StoreIcon, X, ChevronRight, Package, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import {
  VoiceCartService,
  VoiceState,
  ConversationMessage,
  CartAction,
  ProductSelectionEvent,
  ProductOption,
} from '../services/voiceCartService';
import toast from 'react-hot-toast';

const DEMO_STORES = [
  { id: 'DEMO_STORE_1', name: 'TestShop 1 - Kirana Corner' },
  { id: 'DEMO_STORE_2', name: 'TestShop 2 - Daily Needs' },
  { id: 'DEMO_STORE_3', name: 'TestShop 3 - Fresh Mart' },
];

const AIVoiceCart: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useAuthStore();
  const { items, addItem, removeItem, getItemCount, getSubtotal } = useCartStore();

  const [state, setState] = useState<VoiceState>('idle');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [selectedStoreName, setSelectedStoreName] = useState<string | null>(null);
  const [showStorePicker, setShowStorePicker] = useState(false);
  const [productSelection, setProductSelection] = useState<ProductSelectionEvent | null>(null);
  const [wavePhase, setWavePhase] = useState(0);

  const serviceRef = useRef<VoiceCartService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  // Initialize service
  useEffect(() => {
    const svc = new VoiceCartService({
      onStateChange: (s) => setState(s),
      onConversation: (msg) => {
        setConversation((prev) => [...prev, msg]);
      },
      onCartAction: (action: CartAction) => {
        handleCartAction(action);
      },
      onProductSelection: (event) => {
        setProductSelection(event);
        if (event) {
          serviceRef.current?.muteMic();
        } else {
          serviceRef.current?.unmuteMic();
        }
      },
    });
    serviceRef.current = svc;

    return () => {
      svc.dispose();
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Waveform animation loop
  useEffect(() => {
    if (state === 'listening' || state === 'aiSpeaking') {
      const animate = () => {
        setWavePhase((p) => p + 0.08);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [state]);

  // Auto-scroll conversation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleCartAction = useCallback((action: CartAction) => {
    const productForCart = {
      product_id: action.product.product_id || action.product.productId,
      store_id: action.storeId,
      name: action.product.name,
      category: action.product.category || '',
      price: action.product.price,
      unit: action.product.unit || '',
      stock_quantity: 999,
    };

    if (action.action === 'add') {
      addItem(productForCart, action.storeId, action.quantity);
      toast.success(`✅ ${action.product.name} added to cart`);
    } else if (action.action === 'update') {
      removeItem(productForCart.product_id);
      addItem(productForCart, action.storeId, action.quantity);
      toast(`🔄 ${action.product.name} updated to ${action.quantity}`, { icon: '🔄' });
    } else if (action.action === 'remove') {
      removeItem(productForCart.product_id);
      toast(`🗑️ ${action.product.name} removed from cart`, { icon: '🗑️' });
    }
  }, [addItem, removeItem]);

  const handleStoreSelect = async (storeId: string, storeName: string) => {
    setShowStorePicker(false);
    setSelectedStoreName(storeName);

    try {
      await serviceRef.current?.startSession('user_123', {
        storeId,
        lat: isDemoMode ? undefined : 23.2599,
        lng: isDemoMode ? undefined : 77.4126,
      });

      await new Promise((r) => setTimeout(r, 500));

      // Sync existing cart
      if (items.length > 0) {
        serviceRef.current?.sendCartSync(
          items.map((i) => ({
            product_id: i.product.product_id,
            quantity: i.quantity,
          }))
        );
      }

      await serviceRef.current?.startLiveStreaming();

      // Add greeting
      setConversation((prev) => [
        ...prev,
        {
          text: `Namaste! Aap ${storeName} se shopping kar rahe hain. Bataiye aapko kya chahiye?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (e: any) {
      toast.error(`Connection failed: ${e.message || e}`);
    }
  };

  const handleToggleSession = () => {
    if (state === 'idle' || state === 'error') {
      setShowStorePicker(true);
    } else {
      serviceRef.current?.endSession();
      setState('idle');
      setSelectedStoreName(null);
      setProductSelection(null);
    }
  };

  const handleProductSelect = (option: ProductOption) => {
    if (productSelection) {
      serviceRef.current?.sendProductSelection(option.productId, productSelection.quantity);
    }
    setProductSelection(null);
    serviceRef.current?.unmuteMic();
  };

  const isActive = state !== 'idle' && state !== 'error';
  const isListening = state === 'listening';
  const cartCount = getItemCount();

  // ---- Helpers ----
  const getStatusText = () => {
    switch (state) {
      case 'idle': return 'Tap mic to start';
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'listening': return 'Listening...';
      case 'processing': return 'Processing...';
      case 'aiSpeaking': return 'AI is speaking...';
      case 'error': return 'Connection error';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'idle': return 'text-textTertiary';
      case 'connecting': return 'text-warning';
      case 'connected': return 'text-primary';
      case 'listening': return 'text-primary';
      case 'processing': return 'text-warning';
      case 'aiSpeaking': return 'text-info';
      case 'error': return 'text-error';
    }
  };

  const getButtonLabel = () => {
    switch (state) {
      case 'idle': case 'error': return 'Tap to start voice shopping';
      case 'connecting': return 'Connecting...';
      case 'listening': return "Speak naturally — I'm listening";
      case 'aiSpeaking': return 'AI is responding...';
      case 'processing': return 'Processing your request...';
      case 'connected': return 'Ready';
    }
  };

  const formatTime = (d: Date) =>
    `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ---- Top Bar ---- */}
      <div className="px-5 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-surface rounded-xl border border-border flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-textPrimary" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-textPrimary">Voice Shopping</h1>
          <p className={`text-xs ${getStatusColor()}`}>{getStatusText()}</p>
        </div>

        {/* Cart icon */}
        <button
          onClick={() => navigate('/cart')}
          className="w-11 h-11 bg-surface rounded-xl border border-border flex items-center justify-center relative flex-shrink-0"
        >
          <ShoppingCart className="w-5 h-5 text-textPrimary" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-primary text-buttonText text-[9px] font-black rounded-full flex items-center justify-center">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        {/* LIVE badge */}
        {isActive && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/15 border border-primary/30 rounded-full flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary tracking-widest">LIVE</span>
          </div>
        )}
      </div>

      {/* ---- State Indicator (Waveform) ---- */}
      <div className="h-10 flex items-center justify-center px-6">
        {(state === 'listening' || state === 'aiSpeaking') && (
          <div className="flex items-center gap-[3px]">
            {Array.from({ length: 20 }, (_, i) => {
              const phase = (i / 20) * Math.PI * 2 + wavePhase;
              const h = 8 + Math.sin(phase) * 12;
              const color = state === 'listening' ? '#CDFF00' : '#00AAFF';
              const opacity = 0.4 + Math.abs(Math.sin(phase)) * 0.6;
              return (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    height: Math.abs(h),
                    backgroundColor: color,
                    opacity,
                    transition: 'height 0.1s ease',
                  }}
                />
              );
            })}
          </div>
        )}
        {state === 'processing' && (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      {/* ---- Conversation ---- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-2">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-[100px] h-[100px] rounded-full bg-surface border-2 border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(205,255,0,0.08)]">
              <Mic className="w-12 h-12 text-textTertiary/50" />
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-2">Voice Shopping</h2>
            <p className="text-sm text-textTertiary text-center leading-relaxed">
              Tap the mic to start talking
              <br />
              Speak naturally in Hindi or Hinglish
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-3 border ${
                    msg.isUser
                      ? 'bg-primary/12 border-primary/25 rounded-[18px_18px_4px_18px]'
                      : 'bg-surface border-border rounded-[18px_18px_18px_4px]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {msg.isUser ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-primary/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    ) : (
                      <StoreIcon className="w-3.5 h-3.5 text-info" />
                    )}
                    <span
                      className={`text-[11px] font-semibold ${
                        msg.isUser ? 'text-primary' : 'text-info'
                      }`}
                    >
                      {msg.isUser ? 'You' : 'AI Shopkeeper'}
                    </span>
                  </div>
                  <p className="text-sm text-textPrimary leading-relaxed">{msg.text}</p>
                  <p className="text-[10px] text-textTertiary mt-1">{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- Product Selection Panel ---- */}
      {productSelection && (
        <div className="bg-surface border-t border-border max-h-[300px] flex flex-col">
          <div className="px-4 py-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-textPrimary flex-1">
              Select {productSelection.productName}
            </span>
            <button
              onClick={() => {
                setProductSelection(null);
                serviceRef.current?.unmuteMic();
              }}
            >
              <X className="w-5 h-5 text-textSecondary" />
            </button>
          </div>
          <div className="border-t border-border" />
          <div className="overflow-y-auto flex-1 py-2">
            {productSelection.options.map((opt) => (
              <button
                key={opt.productId}
                onClick={() => handleProductSelect(opt)}
                className="w-full mx-4 mb-2.5 p-3 bg-background border border-border rounded-xl flex items-center gap-3 hover:border-primary/30 transition-colors"
                style={{ width: 'calc(100% - 32px)' }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-textPrimary">{opt.name}</p>
                  {opt.brand && (
                    <p className="text-[11px] text-textSecondary">{opt.brand}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-primary">₹{opt.price.toFixed(0)}</span>
                    <span className="text-[11px] text-textSecondary">/ {opt.unit}</span>
                    {opt.inCart > 0 && (
                      <span className="text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded">
                        {opt.inCart} in cart
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-buttonText text-lg font-bold">+</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- Cart Preview ---- */}
      {items.length > 0 && (
        <div className="mx-5 p-4 bg-surface rounded-2xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-[18px] h-[18px] text-primary" />
            <span className="text-[15px] font-bold text-textPrimary flex-1">Your Cart</span>
            <span className="text-xs text-textSecondary">{items.length} items</span>
          </div>

          {/* Horizontal scrollable items */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2.5">
            {items.map((item) => (
              <div
                key={item.product.product_id}
                className="flex-shrink-0 px-3 py-2 bg-surfaceVariant rounded-xl border border-border flex items-center gap-1.5"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-textPrimary whitespace-nowrap">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-primary">
                    {item.quantity}x ₹{item.product.price.toFixed(0)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product.product_id)}
                  className="w-5 h-5 bg-error/15 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <X className="w-3 h-3 text-error" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-xs font-medium text-textSecondary">Subtotal</span>
            <div className="flex items-center gap-3">
              <span className="text-[17px] font-bold text-primary">
                ₹{getSubtotal().toFixed(0)}
              </span>
              <button
                onClick={() => navigate('/cart')}
                className="w-9 h-9 bg-gradient-to-br from-primary to-primaryDark rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(205,255,0,0.3)]"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Voice Button ---- */}
      <div className="py-4 px-6 flex flex-col items-center">
        <p className="text-[13px] text-textTertiary mb-3.5">{getButtonLabel()}</p>
        <button
          onClick={state === 'connecting' ? undefined : handleToggleSession}
          disabled={state === 'connecting'}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
            isListening
              ? 'bg-gradient-to-br from-primary to-primaryDark shadow-primary/30 animate-pulse'
              : state === 'aiSpeaking'
              ? 'bg-gradient-to-br from-info to-blue-600 shadow-info/30'
              : isActive
              ? 'bg-gradient-to-br from-primary to-primaryDark shadow-primary/20'
              : 'bg-gradient-to-br from-surface to-surfaceVariant border-2 border-border'
          }`}
        >
          {state === 'idle' || state === 'error' ? (
            <Mic className="w-9 h-9 text-textTertiary" />
          ) : state === 'connecting' ? (
            <Loader2 className="w-9 h-9 text-buttonText animate-spin" />
          ) : state === 'listening' ? (
            <BarChart3 className="w-9 h-9 text-buttonText" />
          ) : state === 'aiSpeaking' ? (
            <Volume2 className="w-9 h-9 text-buttonText" />
          ) : state === 'processing' ? (
            <Sparkles className="w-9 h-9 text-buttonText" />
          ) : (
            <Mic className="w-9 h-9 text-buttonText" />
          )}
        </button>
      </div>

      {/* ---- Store Picker Modal ---- */}
      {showStorePicker && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowStorePicker(false)}
        >
          <div
            className="bg-surface rounded-t-3xl w-full max-w-lg p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-textPrimary mb-1">Select a Shop</h2>
            <p className="text-sm text-textSecondary mb-5">
              Choose which shop to build your voice cart for
            </p>
            <div className="space-y-2">
              {DEMO_STORES.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleStoreSelect(store.id, store.name)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 rounded-xl transition-colors"
                >
                  <StoreIcon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-[15px] font-semibold text-textPrimary flex-1 text-left">
                    {store.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-textTertiary flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVoiceCart;
