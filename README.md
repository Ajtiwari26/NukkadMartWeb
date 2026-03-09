# NukkadMart Web - React Version

React web application replicating the NukkadMart Flutter app functionality.

## 🚀 Quick Start

```bash
# Install dependencies
cd NukkadMartWeb
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling (matching Flutter app colors)
- **Zustand** - State management
- **React Query** - Server state
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icons

## 🎨 Design System

Matches Flutter app exactly:
- Background: `#121212`
- Surface: `#1e1e1e`
- Primary: `#a3d838` (green)
- Text Primary: `#ffffff`
- Border: `#2d2d2d`

## 📁 Project Structure

```
NukkadMartWeb/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Buttons, inputs, cards
│   │   ├── layout/         # Header, footer, navigation
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── Store.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Profile.tsx
│   │   ├── Orders.tsx
│   │   ├── AIScanner.tsx
│   │   └── VoiceCart.tsx
│   ├── store/              # Zustand stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── storeStore.ts
│   ├── services/           # API services
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── stores.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── config/             # Configuration
│   └── App.tsx             # Main app component
├── public/                 # Static assets
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://13.235.254.91:8000
VITE_WS_URL=ws://13.235.254.91:8000/api/v1
```

For local development:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/api/v1
```

## ✨ Features

### Implemented
- ✅ Authentication (Login, Register, Quick Register)
- ✅ Store browsing (Demo & Real mode)
- ✅ Product listing and search
- ✅ Cart management
- ✅ Checkout flow
- ✅ Order placement
- ✅ Order history
- ✅ Profile management

### In Progress
- 🔄 AI Scanner (Camera + OCR)
- 🔄 Voice Shopping (WebRTC + WebSocket)
- 🔄 Google Maps integration
- 🔄 Payment gateway (Razorpay)

## 🎯 Key Differences from Flutter

1. **Voice Features**: Uses Web Audio API instead of native
2. **Camera**: Uses `getUserMedia()` instead of native camera
3. **File Upload**: Uses `FormData` instead of `MultipartFile`
4. **Storage**: Uses `localStorage` instead of SharedPreferences
5. **Navigation**: React Router instead of Flutter Navigator

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for both mobile and desktop

## 🚢 Deployment

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

### Manual
```bash
npm run build
# Upload 'dist' folder to any static hosting
```

## 🔗 API Integration

All API calls go through `src/services/api.ts` which handles:
- Authentication tokens
- Error handling
- Request/response interceptors
- Retry logic

## 🎨 Component Examples

### Button Component
```tsx
<Button variant="primary" onClick={handleClick}>
  Add to Cart
</Button>
```

### Product Card
```tsx
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
/>
```

### Store Card
```tsx
<StoreCard
  store={store}
  onSelect={handleSelectStore}
/>
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📝 Development Notes

1. **State Management**: Zustand for global state, React Query for server state
2. **Styling**: TailwindCSS with custom theme matching Flutter colors
3. **Icons**: Lucide React (similar to Flutter's icons)
4. **Forms**: React Hook Form for form validation
5. **Toasts**: React Hot Toast for notifications

## 🐛 Known Issues

- Voice features require HTTPS in production
- Camera access needs user permission
- WebSocket connections may need reconnection logic
- Some animations differ from Flutter version

## 🤝 Contributing

This is a hackathon project. For production use, consider:
- Adding comprehensive tests
- Implementing error boundaries
- Adding analytics
- Optimizing bundle size
- Adding PWA support

## 📄 License

Same as NukkadMart Flutter app

## 🔗 Related Projects

- **NukkadMart** (Flutter) - Mobile app
- **NukkadStore** (Flutter) - Store owner app
- **NukkadBackend** (FastAPI) - Backend API
