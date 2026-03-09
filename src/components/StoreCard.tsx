import React from 'react';
import { Store as StoreIcon, MapPin, Clock } from 'lucide-react';
import { Card } from './common/Card';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
  onClick: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  return (
    <Card onClick={() => onClick(store)} className="hover:scale-[1.02]">
      <div className="flex gap-4">
        {/* Store Image */}
        <div className="w-20 h-20 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
          {store.image_url ? (
            <img
              src={store.image_url}
              alt={store.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <StoreIcon className="w-10 h-10 text-primary" />
          )}
        </div>

        {/* Store Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-textPrimary truncate">
              {store.name}
            </h3>
            {store.is_demo && (
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-lg flex-shrink-0">
                Demo
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 text-sm text-textSecondary">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{store.address}</span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            {store.distance && (
              <span className="text-sm text-textTertiary">
                {store.distance.toFixed(1)} km
              </span>
            )}
            {store.delivery_time && (
              <div className="flex items-center gap-1 text-sm text-textTertiary">
                <Clock className="w-4 h-4" />
                <span>{store.delivery_time}</span>
              </div>
            )}
            {store.rating && (
              <span className="text-sm text-primary">
                ⭐ {store.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
