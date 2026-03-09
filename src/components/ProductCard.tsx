import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { Card } from './common/Card';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  storeId?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, storeId }) => {
  const { addItem, increaseQuantity, decreaseQuantity, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(product.product_id);
  const effectiveStoreId = storeId || product.store_id;

  const handleAdd = () => {
    if (quantity === 0) {
      addItem(product, effectiveStoreId, 1);
      toast.success(`${product.name} added to cart`);
    } else {
      increaseQuantity(product.product_id);
    }
  };

  const handleRemove = () => {
    decreaseQuantity(product.product_id);
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Product Image */}
      <div className="w-full aspect-square bg-background rounded-xl mb-3 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-textTertiary" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-textPrimary line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        {product.brand && (
          <p className="text-sm text-textTertiary mb-2">{product.brand}</p>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            ₹{product.price}
          </span>
          <span className="text-sm text-textTertiary">
            / {product.unit}
          </span>
        </div>

        {/* Stock Status */}
        {product.stock_quantity > 0 ? (
          <p className="text-xs text-textTertiary mb-3">
            {product.stock_quantity} in stock
          </p>
        ) : (
          <p className="text-xs text-error mb-3">Out of stock</p>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              disabled={product.stock_quantity === 0}
              className="w-full h-10 bg-primary text-buttonText font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center justify-between bg-primary rounded-xl p-1.5">
              <button
                onClick={handleRemove}
                className="w-8 h-8 flex items-center justify-center bg-buttonText rounded-lg text-primary"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-buttonText">{quantity}</span>
              <button
                onClick={handleAdd}
                disabled={quantity >= product.stock_quantity}
                className="w-8 h-8 flex items-center justify-center bg-buttonText rounded-lg text-primary disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
