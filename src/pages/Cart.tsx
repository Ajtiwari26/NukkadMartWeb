import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Minus, Plus, Truck, ShoppingBag, Tag, CreditCard, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/orders';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    fulfillmentType,
    setFulfillmentType,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    getItemCount,
  } = useCartStore();
  const { user, isDemoMode } = useAuthStore();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = isDemoMode ? 0 : getDeliveryFee();
  const handlingFee = isDemoMode ? 0 : getTax();
  const total = isDemoMode ? subtotal : (fulfillmentType === 'TAKEAWAY' ? subtotal : getTotal());
  const isDelivery = fulfillmentType === 'DELIVERY';

  // Group items by store
  const storeGroups: Record<string, typeof items> = {};
  items.forEach((item) => {
    const sid = item.storeId || item.product.store_id;
    if (!storeGroups[sid]) storeGroups[sid] = [];
    storeGroups[sid].push(item);
  });

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    try {
      // Place one order per store
      for (const [storeId, storeItems] of Object.entries(storeGroups)) {
        const orderData = {
          store_id: storeId,
          items: storeItems.map((item) => ({
            product_id: item.product.product_id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            unit: item.product.unit,
          })),
          total_amount: storeItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
          fulfillment_type: fulfillmentType,
          payment_method: isDemoMode ? 'demo' : 'cod',
        };
        await orderService.createOrder(orderData);
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // EMPTY CART STATE
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center gap-2 px-2 pt-2 pb-0">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-textPrimary" />
          </button>
          <h1 className="text-lg font-bold text-textPrimary">Your Cart</h1>
        </div>

        <div className="flex flex-col items-center justify-center h-[70vh]">
          <ShoppingCart className="w-16 h-16 text-textTertiary mb-4" />
          <h2 className="text-lg font-bold text-textSecondary mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-textTertiary mb-6">
            Start adding items from a store nearby
          </p>
          <button
            onClick={() => navigate('/home')}
            className="h-12 px-8 bg-primary text-buttonText font-bold rounded-2xl"
          >
            Browse Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-2 pb-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-textPrimary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-textPrimary">Your Cart</h1>
            <p className="text-xs text-textTertiary">{getItemCount()} items</p>
          </div>
        </div>
        <button
          onClick={() => {
            clearCart();
            navigate(-1);
          }}
          className="text-sm font-semibold text-error px-3 py-1"
        >
          Clear
        </button>
      </div>

      {/* Cart Items grouped by store */}
      <div className="px-4 pt-2 space-y-2">
        {Object.entries(storeGroups).map(([storeId, storeItems]) => (
          <div key={storeId}>
            <p className="text-sm font-bold text-primary mb-2 mt-4">
              Store: {storeId}
            </p>
            {storeItems.map((item) => (
              <CartItemTile
                key={item.product.product_id}
                item={item}
                onIncrease={() => increaseQuantity(item.product.product_id)}
                onDecrease={() => decreaseQuantity(item.product.product_id)}
                onRemove={() => removeItem(item.product.product_id)}
                onUpdateQty={(qty) => updateQuantity(item.product.product_id, qty)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Fulfillment Toggle */}
      <div className="px-4 pt-4">
        <div className="bg-surface border border-border rounded-2xl p-4">
          <h3 className="text-base font-bold text-textPrimary mb-3">Fulfillment</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setFulfillmentType('DELIVERY')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-[1.5px] font-bold text-sm transition-all ${
                isDelivery
                  ? 'bg-primary border-primary text-buttonText'
                  : 'bg-surfaceVariant border-border text-textSecondary'
              }`}
            >
              <Truck className="w-5 h-5" />
              Delivery
            </button>
            <button
              onClick={() => setFulfillmentType('TAKEAWAY')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-[1.5px] font-bold text-sm transition-all ${
                !isDelivery
                  ? 'bg-primary border-primary text-buttonText'
                  : 'bg-surfaceVariant border-border text-textSecondary'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Takeaway
            </button>
          </div>
          {isDelivery && subtotal >= 199 && (
            <div className="flex items-center gap-1.5 mt-3">
              <Tag className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-semibold text-success">
                Free delivery on this order!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bill Details */}
      <div className="px-4 pt-4">
        <div className="bg-surface border border-border rounded-2xl p-4">
          <h3 className="text-base font-bold text-textPrimary mb-3">Bill Details</h3>
          <div className="space-y-2">
            <BillRow label="Subtotal" value={subtotal} />
            {isDelivery && (
              <>
                <BillRow
                  label="Delivery Charges"
                  value={deliveryFee}
                  suffix={deliveryFee === 0 ? (isDemoMode ? 'DEMO' : 'FREE') : undefined}
                />
                <BillRow label="Handling Fee" value={handlingFee} />
              </>
            )}
            <div className="border-t border-border my-2" />
            <BillRow label="Total" value={total} isTotal />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 pt-4">
        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-surfaceVariant rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-textSecondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-textTertiary font-medium">Payment Method</p>
            <p className="text-sm font-semibold text-textPrimary">
              {isDemoMode ? '🧪 Demo — No Payment' : 'Pay via UPI'}
            </p>
          </div>
          <span className="text-sm font-semibold text-primary">Change</span>
        </div>
      </div>

      {/* Bottom Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-textTertiary tracking-wider">TOTAL</p>
            <p className="text-[22px] font-extrabold text-textPrimary">
              ₹{total.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="flex items-center gap-2 px-8 py-4 bg-primary rounded-2xl disabled:opacity-50"
          >
            {isPlacingOrder ? (
              <div className="w-5 h-5 border-2 border-buttonText border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-base font-bold text-buttonText">Place Order</span>
                <ChevronRight className="w-5 h-5 text-buttonText" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

interface CartItemTileProps {
  item: { product: any; quantity: number; storeId: string };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}

const CartItemTile: React.FC<CartItemTileProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  onUpdateQty,
}) => {
  const [editingQty, setEditingQty] = useState(false);
  const [qtyInput, setQtyInput] = useState(String(item.quantity));

  const handleQtySubmit = () => {
    const newQty = parseInt(qtyInput, 10);
    if (!isNaN(newQty) && newQty > 0) {
      onUpdateQty(newQty);
    }
    setEditingQty(false);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 mb-2.5 flex items-start gap-3">
      {/* Product Image */}
      <div className="w-14 h-14 bg-surfaceVariant rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
        {item.product.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ShoppingBag className="w-6 h-6 text-textTertiary" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-textPrimary truncate">
          {item.product.name}
        </p>
        {item.product.unit && (
          <p className="text-xs text-textTertiary">{item.product.unit}</p>
        )}
        <p className="text-[15px] font-bold text-textPrimary mt-1">
          ₹{item.product.price.toFixed(0)}
        </p>
      </div>

      {/* Quantity Controls + Delete */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center w-[90px] h-9 border border-primary rounded-lg overflow-hidden">
          <button
            onClick={onDecrease}
            className="w-7 h-full flex items-center justify-center"
          >
            <Minus className="w-4 h-4 text-primary" />
          </button>
          {editingQty ? (
            <input
              type="number"
              value={qtyInput}
              onChange={(e) => setQtyInput(e.target.value)}
              onBlur={handleQtySubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleQtySubmit()}
              className="w-full h-full text-center text-sm font-bold text-primary bg-transparent border-none outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={() => {
                setQtyInput(String(item.quantity));
                setEditingQty(true);
              }}
              className="flex-1 text-center text-sm font-bold text-primary"
            >
              {item.quantity}
            </button>
          )}
          <button
            onClick={onIncrease}
            className="w-7 h-full flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        </div>

        <button
          onClick={onRemove}
          className="w-9 h-9 bg-error/10 rounded-lg flex items-center justify-center"
        >
          <Trash2 className="w-[18px] h-[18px] text-error" />
        </button>
      </div>
    </div>
  );
};

interface BillRowProps {
  label: string;
  value: number;
  isTotal?: boolean;
  suffix?: string;
}

const BillRow: React.FC<BillRowProps> = ({ label, value, isTotal, suffix }) => (
  <div className="flex items-center justify-between py-1">
    <span className={isTotal ? 'text-base font-bold text-textPrimary' : 'text-sm text-textSecondary'}>
      {label}
    </span>
    <div className="flex items-center gap-1.5">
      {suffix && (
        <span className="text-[10px] font-bold text-success bg-success/15 px-1.5 py-0.5 rounded">
          {suffix}
        </span>
      )}
      <span className={isTotal ? 'text-lg font-bold text-primary' : 'text-sm font-medium text-textPrimary'}>
        ₹{value.toFixed(2)}
      </span>
    </div>
  </div>
);

export default Cart;
