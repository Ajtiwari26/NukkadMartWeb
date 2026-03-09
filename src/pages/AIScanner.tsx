import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Image as ImageIcon, HelpCircle, Store, ChevronDown, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { API_CONFIG } from '../config/api';
import axios from 'axios';

const AIScanner: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useAuthStore();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedStoreName, setSelectedStoreName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const demoStores = [
    { id: 'DEMO_STORE_1', name: 'TestShop 1 - Kirana Corner' },
    { id: 'DEMO_STORE_2', name: 'TestShop 2 - Daily Needs' },
    { id: 'DEMO_STORE_3', name: 'TestShop 3 - Fresh Mart' },
  ];

  const showStorePicker = (onStoreSelected: () => void) => {
    if (isDemoMode) {
      // Show modal to select store
      const storeButtons = demoStores.map(store => 
        `<button 
          onclick="window.selectStore('${store.id}', '${store.name}')" 
          class="w-full text-left px-4 py-3 hover:bg-primary/10 rounded-lg flex items-center gap-3 mb-2"
        >
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <p class="font-semibold text-textPrimary">${store.name}</p>
          </div>
        </button>`
      ).join('');
      
      const modalHtml = `
        <div id="storePickerModal" class="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onclick="if(event.target.id==='storePickerModal') document.getElementById('storePickerModal').remove()">
          <div class="bg-surface rounded-t-3xl w-full max-w-lg p-6 animate-slide-up" onclick="event.stopPropagation()">
            <h2 class="text-xl font-bold text-textPrimary mb-2">Select a Shop</h2>
            <p class="text-sm text-textSecondary mb-4">Choose which shop to scan your list for</p>
            <div class="space-y-2">
              ${storeButtons}
            </div>
          </div>
        </div>
      `;
      
      const modalDiv = document.createElement('div');
      modalDiv.innerHTML = modalHtml;
      document.body.appendChild(modalDiv);
      
      (window as any).selectStore = (id: string, name: string) => {
        setSelectedStoreId(id);
        setSelectedStoreName(name);
        document.getElementById('storePickerModal')?.remove();
        onStoreSelected();
      };
    } else {
      toast.error('Please select a store from home screen first');
    }
  };

  const processImage = async (file: File) => {
    setCapturedImage(URL.createObjectURL(file));
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const storeId = selectedStoreId || demoStores[0].id;
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/ocr/upload-and-match?store_id=${storeId}&wait_for_result=true&is_demo=${isDemoMode}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      const data = response.data;
      
      // Navigate to draft cart with results
      navigate('/draft-cart', {
        state: {
          matchedItems: data.matched || [],
          unmatchedItems: data.unmatched || [],
          suggestions: data.suggestions || [],
          storeId: storeId,
        },
      });
    } catch (error: any) {
      console.error('OCR error:', error);
      setErrorMessage(error.response?.data?.detail || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = () => {
    // Always show store picker first if no store selected
    if (!selectedStoreId) {
      showStorePicker(() => {
        // After store is selected, trigger camera
        setTimeout(() => cameraInputRef.current?.click(), 100);
      });
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleGallery = () => {
    // Always show store picker first if no store selected
    if (!selectedStoreId) {
      showStorePicker(() => {
        // After store is selected, trigger gallery
        setTimeout(() => fileInputRef.current?.click(), 100);
      });
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const showHelp = () => {
    toast(
      <div className="space-y-2">
        <p className="font-bold">AI Scanner Help</p>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Write your shopping list on paper</li>
          <li>Take a photo or pick from gallery</li>
          <li>AI reads and matches items to products</li>
          <li>Review and add to cart</li>
        </ol>
      </div>,
      { duration: 5000, icon: '✨' }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-surface rounded-xl border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-textPrimary" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-primary tracking-wider">AI SCANNER</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Store Selector */}
          <button
            onClick={() => showStorePicker(() => {})}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 bg-surfaceVariant border border-border rounded-full"
          >
            <Store className="w-3.5 h-3.5 text-textTertiary" />
            <span className="text-[11px] font-semibold text-textTertiary max-w-[90px] truncate">
              {selectedStoreName?.split(' - ')[0] || 'Select Shop'}
            </span>
            <ChevronDown className="w-4 h-4 text-textTertiary" />
          </button>

          <button
            onClick={showHelp}
            className="w-10 h-10 bg-surface rounded-xl border border-border flex items-center justify-center"
          >
            <HelpCircle className="w-5 h-5 text-textSecondary" />
          </button>
        </div>
      </div>

      {/* Camera Viewfinder / Captured Image */}
      <div className="px-4 mt-3 flex-1 flex flex-col">
        <div className="relative flex-1 bg-surfaceVariant rounded-3xl border border-border overflow-hidden">
          {capturedImage ? (
            <>
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-white font-semibold">AI is reading your list...</p>
                  <p className="text-white/70 text-sm mt-2">This may take a few seconds</p>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="w-16 h-16 text-textTertiary/30 mb-4" />
              
              {/* Scan Frame */}
              <div className="absolute inset-10">
                <svg className="w-full h-full">
                  <rect
                    x="0"
                    y="0"
                    width="30"
                    height="3"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <rect
                    x="0"
                    y="0"
                    width="3"
                    height="30"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <rect
                    x="calc(100% - 30px)"
                    y="0"
                    width="30"
                    height="3"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <rect
                    x="calc(100% - 3px)"
                    y="0"
                    width="3"
                    height="30"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <rect
                    x="0"
                    y="calc(100% - 3px)"
                    width="30"
                    height="3"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <rect
                    x="0"
                    y="calc(100% - 30px)"
                    width="3"
                    height="30"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <rect
                    x="calc(100% - 30px)"
                    y="calc(100% - 3px)"
                    width="30"
                    height="3"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <rect
                    x="calc(100% - 3px)"
                    y="calc(100% - 30px)"
                    width="3"
                    height="30"
                    fill="currentColor"
                    className="text-primary"
                  />
                </svg>
              </div>

              <div className="absolute bottom-6 bg-black/60 px-5 py-2.5 rounded-full">
                <p className="text-[13px] text-white font-medium">
                  Point camera at your shopping list
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mx-4 mt-4 p-3 bg-error/10 border border-error/30 rounded-xl flex items-start gap-2">
          <span className="text-error">⚠️</span>
          <p className="text-xs text-error flex-1">{errorMessage}</p>
        </div>
      )}

      {/* Instructions */}
      {!isProcessing && !capturedImage && (
        <div className="px-4 mt-4">
          <p className="text-center text-sm text-textSecondary">
            Capture a clear photo of your handwritten list. The AI will extract items and find the best matches in the store.
          </p>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center gap-3 px-4">
        <button
          onClick={handleGallery}
          disabled={isProcessing}
          className="w-14 h-14 bg-surface rounded-full shadow-lg flex items-center justify-center disabled:opacity-50"
        >
          <ImageIcon className="w-6 h-6 text-primary" />
        </button>

        <button
          onClick={handleCapture}
          disabled={isProcessing}
          className="h-14 px-6 bg-gradient-to-r from-primary to-primaryDark text-buttonText font-bold rounded-full shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
          <span>Capture</span>
        </button>
      </div>
    </div>
  );
};

export default AIScanner;
