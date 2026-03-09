# NukkadMart Web - Setup & Build Instructions

## ✅ What's Been Created

### Core Infrastructure
- ✅ Project configuration (Vite, TypeScript, TailwindCSS)
- ✅ API configuration and services
- ✅ Type definitions
- ✅ State management (Zustand stores)
- ✅ Routing setup (React Router)
- ✅ Authentication flow
- ✅ Cart management
- ✅ API services (auth, stores, products, orders)

### Components Created
- ✅ Button component
- ✅ App shell with routing

## 🚧 What Needs to Be Built

### Pages (Priority Order)
1. **Login Page** - Authentication UI
2. **Home Page** - Store selection, demo mode
3. **Store Page** - Product listing
4. **Cart Page** - Cart management
5. **Checkout Page** - Order placement
6. **Profile Page** - User settings
7. **Orders Page** - Order history

### Components Needed
- Input, Card, ProductCard, StoreCard
- Header, BottomNav
- Loading, Error states
- Modal, Toast

### Features to Implement
- Voice Shopping (WebRTC)
- AI Scanner (Camera + OCR)
- Google Maps integration
- Payment gateway

## 📦 Installation

```bash
cd NukkadMartWeb
npm install
```

## 🏃 Running the App

```bash
# Development (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Setup

Create `.env` file:
```env
VITE_API_URL=http://13.235.254.91:8000
VITE_WS_URL=ws://13.235.254.91:8000/api/v1
```

## 📝 Next Steps

### Phase 1: Core Pages (2-3 hours)
1. Create Login page with demo mode
2. Create Home page with store listing
3. Create Store page with products
4. Create Cart page
5. Create Checkout page

### Phase 2: Components (1-2 hours)
1. ProductCard component
2. StoreCard component
3. Header component
4. BottomNav component
5. Input component

### Phase 3: Advanced Features (3-4 hours)
1. Voice Shopping integration
2. AI Scanner with camera
3. Google Maps for store location
4. Payment gateway integration

## 🎨 Design System

All components follow the Flutter app design:
- Background: `#121212`
- Surface: `#1e1e1e`
- Primary: `#a3d838`
- Text: `#ffffff`
- Border: `#2d2d2d`

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔗 API Integration

All API calls use the services in `src/services/`:
- `auth.ts` - Authentication
- `stores.ts` - Store operations
- `products.ts` - Product operations
- `orders.ts` - Order operations

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📊 Progress Tracker

- [x] Project setup
- [x] API configuration
- [x] Type definitions
- [x] State management
- [x] Routing
- [ ] Login page
- [ ] Home page
- [ ] Store page
- [ ] Cart page
- [ ] Checkout page
- [ ] Profile page
- [ ] Orders page
- [ ] Voice shopping
- [ ] AI Scanner
- [ ] Maps integration
- [ ] Payment integration

## 🤝 Contributing

To continue building:
1. Pick a page from the "What Needs to Be Built" section
2. Create the component in `src/pages/`
3. Follow the design system
4. Test with the backend API
5. Move to next feature

## 📞 Support

For issues or questions, refer to:
- Backend API docs: http://13.235.254.91:8000/docs
- Flutter app for UI reference
- Design system in tailwind.config.js
