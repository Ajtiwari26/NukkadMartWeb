import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Home from './pages/Home';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AIScanner from './pages/AIScanner';
import AIVoiceCart from './pages/AIVoiceCart';
import DraftCart from './pages/DraftCart';
import Search from './pages/Search';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Splash */}
            <Route path="/" element={<Splash />} />
            
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
            
            {/* Protected Routes */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/store/:storeId" element={user ? <Store /> : <Navigate to="/login" />} />
            <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
            <Route path="/ai-scanner" element={user ? <AIScanner /> : <Navigate to="/login" />} />
            <Route path="/ai-voice-cart" element={user ? <AIVoiceCart /> : <Navigate to="/login" />} />
            <Route path="/draft-cart" element={user ? <DraftCart /> : <Navigate to="/login" />} />
          </Routes>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#ffffff',
                border: '1px solid #3A3A3A',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
