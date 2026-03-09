import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  showProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showCart = false,
  showProfile = false,
}) => {
  const navigate = useNavigate();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-textPrimary" />
              </button>
            )}
            <h1 className="text-xl font-bold text-textPrimary">{title}</h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {showCart && (
              <button
                onClick={() => navigate('/cart')}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-textPrimary" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-buttonText text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            {showProfile && (
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface transition-colors"
              >
                <User className="w-6 h-6 text-textPrimary" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
