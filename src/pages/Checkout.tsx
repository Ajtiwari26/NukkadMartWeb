import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/orders';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Address form
  const [address, setAddress] = useState({
    label: 'Home',
    address_line1: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const total = getTotal();

  const handlePlaceOrder = async () => {
    if (!address.address_line1 || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        store_id: items[0]?.storeId,
        items: items.map((item) => ({
          product_id: item.product.product_id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          unit: item.product.unit,
        })),
        total_amount: total,
        delivery_address: address,
        payment_method: paymentMethod,
      };

      await orderService.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders`);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <Header title="Checkout" showBack />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Delivery Address */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-textPrimary">
              Delivery Address
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Address Line 1"
              placeholder="House No., Street Name"
              value={address.address_line1}
              onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
              <Input
                label="Pincode"
                placeholder="462001"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                required
              />
            </div>

            <Input
              label="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              required
            />
          </div>
        </Card>

        {/* Payment Method */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-textPrimary">
              Payment Method
            </h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-textPrimary">
                  Cash on Delivery
                </span>
                {paymentMethod === 'cod' && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('online')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'online'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-textPrimary">
                  Online Payment
                </span>
                {paymentMethod === 'online' && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          </div>
        </Card>

        {/* Order Summary */}
        <Card>
          <h2 className="text-lg font-semibold text-textPrimary mb-4">
            Order Summary
          </h2>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.product.product_id}
                className="flex justify-between text-sm"
              >
                <span className="text-textSecondary">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="text-textPrimary">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-textPrimary">Total</span>
                <span className="text-primary text-lg">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlaceOrder}
            isLoading={isLoading}
            className="w-full"
          >
            Place Order - ₹{total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
