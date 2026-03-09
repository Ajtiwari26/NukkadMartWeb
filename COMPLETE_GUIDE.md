# NukkadMart Web - Complete Setup Guide

## ✅ What's Been Built

### Complete Application Structure
- ✅ **Project Setup** - Vite + React + TypeScript + TailwindCSS
- ✅ **API Integration** - Axios with interceptors, error handling
- ✅ **State Management** - Zustand stores (auth, cart, store)
- ✅ **Routing** - React Router with protected routes
- ✅ **Type Safety** - Complete TypeScript definitions

### Pages (All Complete)
1. ✅ **Login Page** - Authentication with demo mode
2. ✅ **Home Page** - Store listing with demo/real mode
3. ✅ **Store Page** - Product browsing with search & filters
4. ✅ **Cart Page** - Cart management with quantity controls
5. ✅ **Checkout Page** - Address form & payment selection
6. ✅ **Profile Page** - User info & settings
7. ✅ **Orders Page** - Order history with status

### Components (All Complete)
- ✅ Button, Input, Card, Loading
- ✅ Header with cart badge
- ✅ StoreCard with distance & rating
- ✅ ProductCard with add to cart
- ✅ Protected routes

### Features Implemented
- ✅ Authentication (Login + Quick Register)
- ✅ Demo Mode
- ✅ Store browsing
- ✅ Product search & filtering
- ✅ Cart management (add, remove, update)
- ✅ Checkout flow
- ✅ Order placement
- ✅ Order history
- ✅ Responsive design (mobile-first)

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
cd NukkadMartWeb
npm install
```

### Step 2: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env if needed (default points to production backend)
```

### Step 3: Start Development Server
```bash
npm run dev
```

App will open at: **http://localhost:3000**

## 📦 Available Scripts

```bash
# Development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## 🎨 Design System

Matches Flutter app exactly:

```css
Background: #121212
Surface: #1e1e1e
Primary: #a3d838 (green)
Secondary: #8bc34a
Text Primary: #ffffff
Text Secondary: #b3b3b3
Text Tertiary: #808080
Border: #2d2d2d
Error: #cf6679
```

## 🔧 Configuration

### API Endpoints
All configured in `src/config/api.ts`:
- Base URL: `http://13.235.254.91:8000`
- WebSocket: `ws://13.235.254.91:8000/api/v1`

### State Management
- **Auth Store**: User authentication & demo mode
- **Cart Store**: Shopping cart with persistence
- **Store Store**: Selected store & store list

## 📱 Features & Usage

### 1. Authentication
- **Login**: Phone + Password
- **Demo Mode**: Quick start without registration
- Auto token management
- Protected routes

### 2. Store Browsing
- Demo stores in demo mode
- Nearby stores in real mode
- Store cards with distance & rating
- Click to view products

### 3. Product Browsing
- Grid layout (responsive)
- Search functionality
- Category filters
- Stock status
- Add to cart from product card

### 4. Cart Management
- View all cart items
- Update quantities
- Remove items
- Clear cart
- Real-time total calculation
- Persistent across sessions

### 5. Checkout
- Delivery address form
- Payment method selection (COD/Online)
- Order summary
- Place order

### 6. Orders
- Order history
- Order status tracking
- Order details
- Delivery address

### 7. Profile
- User information
- Demo mode indicator
- Quick access to orders
- Logout

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Manual Hosting
```bash
npm run build
# Upload 'dist' folder to any static hosting
```

## 🔗 Backend Integration

### API Services
All in `src/services/`:
- `auth.ts` - Login, register, quick register
- `stores.ts` - Get stores (nearby/demo)
- `products.ts` - Get products, search
- `orders.ts` - Create order, get orders

### Error Handling
- Automatic token refresh
- 401 redirect to login
- Toast notifications
- Retry logic

## 📊 Project Structure

```
NukkadMartWeb/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── Header.tsx
│   │   ├── StoreCard.tsx
│   │   └── ProductCard.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   ├── Store.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Profile.tsx
│   │   └── Orders.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── stores.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── storeStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── config/
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎯 Testing the App

### 1. Test Demo Mode
1. Open http://localhost:3000
2. Click "Start Demo Mode"
3. Browse demo stores
4. Add products to cart
5. Complete checkout

### 2. Test Real Mode
1. Login with credentials
2. View nearby stores
3. Browse products
4. Place order

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### API Connection Issues
- Check backend is running
- Verify API URL in `.env`
- Check CORS settings on backend
- Check network tab in browser DevTools

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚧 Future Enhancements

### Phase 1 (Optional)
- [ ] Voice Shopping (WebRTC)
- [ ] AI Scanner (Camera + OCR)
- [ ] Google Maps integration
- [ ] Payment gateway (Razorpay)

### Phase 2 (Optional)
- [ ] Push notifications
- [ ] PWA support
- [ ] Offline mode
- [ ] Analytics
- [ ] Social sharing

## 📝 Notes

- All core features are complete and working
- Voice and scanner features require additional libraries
- Payment integration needs Razorpay SDK
- Maps needs Google Maps JavaScript API

## 🎉 Ready to Use!

The app is fully functional with all essential features:
- ✅ Authentication
- ✅ Store browsing
- ✅ Product search
- ✅ Cart management
- ✅ Checkout
- ✅ Order placement
- ✅ Order history

Just run `npm install && npm run dev` and start testing!

## 📞 Support

For issues:
1. Check browser console for errors
2. Check network tab for API calls
3. Verify backend is running
4. Check `.env` configuration

Backend API Docs: http://13.235.254.91:8000/docs
