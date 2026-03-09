import { API_CONFIG } from '../config/api';

// ---- Types ----

export type VoiceState = 'idle' | 'connecting' | 'connected' | 'listening' | 'processing' | 'aiSpeaking' | 'error';

export interface ConversationMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface CartAction {
  action: 'add' | 'update' | 'remove';
  product: any;
  quantity: number;
  storeId: string;
}

export interface ProductOption {
  productId: string;
  name: string;
  brand?: string;
  price: number;
  unit: string;
  inCart: number;
  storeId?: string;
  storeName?: string;
}

export interface ProductSelectionEvent {
  productName: string;
  action: string;
  quantity: number;
  options: ProductOption[];
}

// ---- Callbacks ----

export interface VoiceCartCallbacks {
  onStateChange: (state: VoiceState) => void;
  onConversation: (message: ConversationMessage) => void;
  onCartAction: (action: CartAction) => void;
  onProductSelection: (event: ProductSelectionEvent | null) => void;
}

// ---- Service ----

export class VoiceCartService {
  private ws: WebSocket | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private isActive = false;
  private isStreaming = false;
  private isMicMuted = false;
  private isAiSpeaking = false;
  private audioQueue: Blob[] = [];
  private isPlayingAudio = false;
  private callbacks: VoiceCartCallbacks;

  constructor(callbacks: VoiceCartCallbacks) {
    this.callbacks = callbacks;
  }

  get connected() { return this.isActive; }
  get streaming() { return this.isStreaming; }

  // ---- Session management ----

  async startSession(userId: string, opts: { storeId?: string; lat?: number; lng?: number }) {
    try {
      this.callbacks.onStateChange('connecting');

      const wsBase = API_CONFIG.BASE_URL.replace('http', 'ws');
      let url = `${wsBase}${API_CONFIG.API_VERSION}/ws/voice/customer/${userId}`;
      const params: string[] = [];
      if (opts.lat != null && opts.lng != null) {
        params.push(`latitude=${opts.lat}`, `longitude=${opts.lng}`);
      }
      if (opts.storeId) {
        params.push(`store_id=${opts.storeId}`);
      }
      if (params.length) url += '?' + params.join('&');

      this.ws = new WebSocket(url);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        this.isActive = true;
        this.callbacks.onStateChange('connected');
      };

      this.ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          this.handleJsonMessage(event.data);
        } else if (event.data instanceof ArrayBuffer) {
          // Audio data from server (TTS)
          this.isAiSpeaking = true;
          this.callbacks.onStateChange('aiSpeaking');
          this.queueAudio(new Blob([event.data], { type: 'audio/wav' }));
        }
      };

      this.ws.onerror = () => {
        this.isActive = false;
        this.callbacks.onStateChange('error');
      };

      this.ws.onclose = () => {
        this.isActive = false;
        this.callbacks.onStateChange('idle');
      };
    } catch (e) {
      this.callbacks.onStateChange('error');
      throw e;
    }
  }

  async startLiveStreaming() {
    if (!this.isActive || this.isStreaming) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // ScriptProcessorNode for raw PCM access
      this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.scriptProcessor.onaudioprocess = (e) => {
        if (!this.isStreaming || this.isAiSpeaking || this.isMicMuted) return;
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const float32 = e.inputBuffer.getChannelData(0);
        // Convert float32 to int16 PCM
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        this.ws.send(int16.buffer);
      };

      this.sourceNode.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);
      
      this.isStreaming = true;
      this.callbacks.onStateChange('listening');
    } catch (e) {
      console.error('Mic access error:', e);
      throw new Error('Microphone permission denied');
    }
  }

  stopLiveStreaming() {
    this.isStreaming = false;
    this.scriptProcessor?.disconnect();
    this.sourceNode?.disconnect();
    this.audioContext?.close();
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.scriptProcessor = null;
    this.sourceNode = null;
    this.audioContext = null;
    this.mediaStream = null;

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event: 'end_audio' }));
    }
    this.callbacks.onStateChange('processing');
  }

  endSession() {
    this.isActive = false;
    this.isStreaming = false;
    this.stopLiveStreaming();
    this.ws?.close();
    this.ws = null;
    this.callbacks.onStateChange('idle');
  }

  // ---- JSON message handling ----

  private handleJsonMessage(jsonStr: string) {
    try {
      const data = JSON.parse(jsonStr);
      const event = data.event;

      switch (event) {
        case 'context_loaded':
          console.log('Context loaded:', data.data);
          break;

        case 'cart_update':
          this.processCartUpdate(data);
          break;

        case 'product_selection':
          this.callbacks.onProductSelection({
            productName: data.product_name || '',
            action: data.action || 'add',
            quantity: data.quantity || 1,
            options: (data.options || []).map((opt: any) => ({
              productId: opt.product_id || '',
              name: opt.name || '',
              brand: opt.brand,
              price: opt.price || 0,
              unit: opt.unit || '',
              inCart: opt.in_cart || 0,
              storeId: opt.store_id,
              storeName: opt.store_name,
            })),
          });
          break;

        case 'transcript': {
          const text = data.text || '';
          const isUser = data.is_user || false;
          if (text.trim()) {
            this.callbacks.onConversation({
              text,
              isUser,
              timestamp: new Date(),
            });
            if (!isUser) {
              this.isAiSpeaking = true;
              this.callbacks.onStateChange('aiSpeaking');
            }
          }
          break;
        }

        case 'processing':
          this.callbacks.onStateChange('processing');
          break;

        case 'clear_selection':
          this.callbacks.onProductSelection(null);
          break;
      }
    } catch (e) {
      console.error('Error handling message:', e);
    }
  }

  private processCartUpdate(data: any) {
    try {
      const action = data.action || 'add';
      const productData = data.product;
      if (productData) {
        this.callbacks.onCartAction({
          action,
          product: productData,
          quantity: data.quantity || 1,
          storeId: data.store_id || productData.store_id || '',
        });
      }
    } catch (e) {
      console.error('Error processing cart update:', e);
    }
  }

  // ---- Audio playback ----

  private queueAudio(blob: Blob) {
    this.audioQueue.push(blob);
    if (!this.isPlayingAudio) {
      this.playNextAudio();
    }
  }

  private async playNextAudio() {
    if (this.audioQueue.length === 0) {
      this.isPlayingAudio = false;
      this.isAiSpeaking = false;
      if (this.isStreaming) {
        this.callbacks.onStateChange('listening');
      } else {
        this.callbacks.onStateChange('connected');
      }
      return;
    }

    this.isPlayingAudio = true;
    const blob = this.audioQueue.shift()!;
    
    try {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        this.playNextAudio();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        this.playNextAudio();
      };
      await audio.play();
    } catch (e) {
      console.error('Audio playback error:', e);
      this.playNextAudio();
    }
  }

  // ---- Actions ----

  sendProductSelection(productId: string, quantity: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        event: 'product_selected',
        product_id: productId,
        quantity,
      }));
    }
  }

  sendCartSync(cartItems: Array<{ product_id: string; quantity: number }>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        event: 'sync_cart',
        items: cartItems,
      }));
    }
  }

  muteMic() {
    if (this.isMicMuted) return;
    this.isMicMuted = true;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event: 'end_audio' }));
    }
  }

  unmuteMic() {
    if (!this.isMicMuted) return;
    this.isMicMuted = false;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event: 'start_audio' }));
    }
    if (this.isStreaming) {
      this.callbacks.onStateChange('listening');
    }
  }

  dispose() {
    this.endSession();
  }
}
