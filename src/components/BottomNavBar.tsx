import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Mic, ShoppingCart, Clock, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCartStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Mic, label: 'Voice', path: '/ai-voice-cart' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: items.length },
    { icon: Clock, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-primary' : 'text-textTertiary'
                  }`}
                />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-black text-buttonText">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  </div>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? 'text-primary' : 'text-textTertiary'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
