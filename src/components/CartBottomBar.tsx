import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const CartBottomBar: React.FC = () => {
  const navigate = useNavigate();
  const { items, getItemCount, getSubtotal } = useCartStore();

  if (items.length === 0) return null;

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50">
      <button
        onClick={() => navigate('/cart')}
        className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-buttonText text-[9px] font-black rounded-full flex items-center justify-center">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs text-textTertiary">{itemCount} item{itemCount > 1 ? 's' : ''}</p>
            <p className="text-base font-bold text-textPrimary">₹{subtotal.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-primary rounded-xl px-5 py-2.5">
          <span className="text-sm font-bold text-buttonText">View Cart</span>
          <ChevronRight className="w-4 h-4 text-buttonText" />
        </div>
      </button>
    </div>
  );
};

export default CartBottomBar;
