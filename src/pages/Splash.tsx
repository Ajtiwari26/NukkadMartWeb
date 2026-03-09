import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
            <ShoppingCart className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-4xl font-black text-textPrimary tracking-[0.15em]">NUKKAD</span>
          <span className="text-4xl font-black text-primary tracking-[0.15em]">MART</span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-textTertiary">Market at your fingertip</p>

        {/* Loading indicator */}
        <div className="mt-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Splash;
