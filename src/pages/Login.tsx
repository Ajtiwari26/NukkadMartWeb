import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Phone, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setDemoMode } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (!phone.trim() || phone.trim().length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.quickRegister({
        name: name.trim(),
        phone: phone.trim(),
      });

      setUser(response);
      setDemoMode(false);
      toast.success('Welcome to NukkadMart!');
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Demo mode doesn't call backend - just set local state like Flutter app
    const demoUser = {
      id: 'DEMO_USER',
      user_id: 'DEMO_USER',
      name: 'Demo User',
      phone: '0000000000',
      email: undefined,
      total_purchases: 0,
      is_new: false,
      created_at: new Date().toISOString(),
    };

    setUser(demoUser);
    setDemoMode(true);
    toast.success('Entered Demo Mode!');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-6 py-4">
        {/* Demo Mode Button (Top Right) */}
        <div className="flex justify-end mb-5">
          <button
            onClick={handleDemoMode}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-400/15 border border-orange-400/40 rounded-full"
          >
            <span className="text-sm">🧪</span>
            <span className="text-[13px] font-bold text-orange-400">Demo Mode</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-11 h-11 text-primary" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[28px] font-black text-textPrimary tracking-[0.15em]">NUKKAD</span>
          <span className="text-[28px] font-black text-primary tracking-[0.15em]">MART</span>
        </div>

        {/* Tagline */}
        <p className="text-center text-sm text-textTertiary mb-12">Market at your fingertip</p>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Get Started</h2>
        <p className="text-sm text-textSecondary mb-8">
          Enter your details to start shopping from nearby stores
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-2 uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textTertiary" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-14 pl-12 pr-4 bg-surface border border-border rounded-2xl text-textPrimary placeholder-textTertiary focus:outline-none focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-2 uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textTertiary" />
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-textSecondary">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                className="w-full h-14 pl-[4.5rem] pr-4 bg-surface border border-border rounded-2xl text-textPrimary placeholder-textTertiary focus:outline-none focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-xl">
              <p className="text-[13px] text-error">{error}</p>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-primary to-primaryDark text-buttonText font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-buttonText border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-xs text-textTertiary mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
