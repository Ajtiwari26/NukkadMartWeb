import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt, MapPin, CreditCard, Headphones, Settings, LogOut, ChevronRight, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import BottomNavBar from '../components/BottomNavBar';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode, logout } = useAuthStore();
  const { clearCart } = useCartStore();

  const handleLogout = () => {
    logout();
    clearCart();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initial = user?.name?.[0]?.toUpperCase() || '?';

  const menuItems = [
    {
      icon: Receipt,
      title: 'My Orders',
      subtitle: 'View order history & track',
      onClick: () => navigate('/orders'),
    },
    {
      icon: MapPin,
      title: 'Saved Addresses',
      subtitle: 'Manage delivery addresses',
      onClick: () => toast('Saved Addresses — Coming Soon!', { icon: '📍' }),
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'UPI, Cards & Wallets',
      onClick: () => toast('Payment Methods — Coming Soon!', { icon: '💳' }),
    },
    {
      icon: Headphones,
      title: 'Help & Support',
      subtitle: 'FAQs, Chat & Call Support',
      onClick: () => toast('Help & Support — Coming Soon!', { icon: '🎧' }),
    },
    {
      icon: Settings,
      title: 'App Preferences',
      subtitle: 'Notifications, Language, Theme',
      onClick: () => toast('App Preferences — Coming Soon!', { icon: '⚙️' }),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header with gradient */}
      <div
        className="w-full px-6 pt-8 pb-8"
        style={{
          background: 'linear-gradient(to bottom, rgba(205,255,0,0.15), #0A0A0A)',
        }}
      >
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-[90px] h-[90px] rounded-full border-[2.5px] border-primary flex items-center justify-center">
              <div className="w-[84px] h-[84px] rounded-full bg-surfaceVariant flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">{initial}</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-[30px] h-[30px] bg-primary rounded-full border-2 border-background flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-buttonText" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>

          {/* Name */}
          <h2 className="text-xl font-bold text-textPrimary">
            {user?.name || 'Guest User'}
          </h2>

          {/* Phone */}
          {user?.phone && (
            <p className="text-sm text-textSecondary mt-1">{user.phone}</p>
          )}

          {/* AI Badge */}
          <div className="mt-3 px-3.5 py-1.5 bg-primary/15 border border-primary/30 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">
              {isDemoMode ? 'Demo Mode' : 'Nukkad AI Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2.5">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={item.onClick}
            className="w-full bg-surface border border-border rounded-2xl p-4 flex items-center gap-3.5 hover:bg-surfaceVariant transition-colors"
          >
            <div className="w-11 h-11 bg-surfaceVariant rounded-xl flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] font-semibold text-textPrimary">{item.title}</p>
              <p className="text-xs text-textTertiary mt-0.5">{item.subtitle}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-textTertiary flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full h-[52px] border border-error/40 rounded-2xl flex items-center justify-center gap-2 hover:bg-error/10 transition-colors"
        >
          <LogOut className="w-5 h-5 text-error" />
          <span className="font-semibold text-error">Log Out</span>
        </button>
      </div>

      {/* Version */}
      <div className="text-center mt-6 mb-4">
        <p className="text-xs text-textTertiary">Nukkad Mart v2.4.1</p>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default Profile;
