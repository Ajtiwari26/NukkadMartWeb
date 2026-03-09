import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Store as StoreIcon, Receipt } from 'lucide-react';
import { orderService } from '../services/orders';
import { Order, OrderStatus } from '../types';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Delivered', 'Processing', 'Cancelled'];

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getUserOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Delivered') return order.status === 'delivered';
    if (selectedFilter === 'Cancelled') return order.status === 'cancelled';
    if (selectedFilter === 'Processing') {
      return ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);
    }
    return true;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'bg-success/15 text-success';
      case 'cancelled': return 'bg-error/15 text-error';
      case 'out_for_delivery': return 'bg-blue-500/15 text-blue-400';
      default: return 'bg-orange-400/15 text-orange-400';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'On the Way';
      default: return 'Pending';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-2 pb-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-textPrimary" />
          </button>
          <h1 className="text-lg font-bold text-textPrimary">Order History</h1>
        </div>
        <button
          onClick={() => toast('Search Orders — Coming Soon!', { icon: '🔍' })}
          className="w-10 h-10 flex items-center justify-center"
        >
          <Search className="w-5 h-5 text-textPrimary" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="pt-3 pb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4">
          {FILTERS.map((filter) => {
            const isSelected = filter === selectedFilter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2 rounded-full font-medium text-[13px] whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-primary text-buttonText font-semibold'
                    : 'bg-surface border border-border text-textSecondary'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Receipt className="w-14 h-14 text-textTertiary mb-4" />
          <h2 className="text-lg font-bold text-textSecondary mb-2">No orders found</h2>
          <p className="text-sm text-textTertiary">Your order history will appear here</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.order_id}
              className="bg-surface border border-border rounded-2xl p-4"
            >
              {/* Header Row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-surfaceVariant rounded-xl flex items-center justify-center flex-shrink-0">
                  <StoreIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-textPrimary">
                    Order #{order.order_id.slice(-6)}
                  </p>
                  <p className="text-xs text-textTertiary mt-0.5">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* Date + Total */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-textTertiary">
                  {formatDate(order.created_at)}
                </span>
                <span className="text-base font-bold text-primary">
                  ₹{order.total_amount.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => toast('Order tracking — Coming Soon!', { icon: '📦' })}
                  className="flex-1 py-2.5 border border-border rounded-xl text-center text-[13px] font-semibold text-textPrimary hover:bg-surfaceVariant transition-colors"
                >
                  {order.status === 'delivered' ? 'View Details' : 'Track Order'}
                </button>
                {order.status === 'delivered' && (
                  <button
                    onClick={() => toast('Reorder — Coming Soon!', { icon: '🔄' })}
                    className="flex-1 py-2.5 bg-primary rounded-xl text-center text-[13px] font-semibold text-buttonText"
                  >
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
