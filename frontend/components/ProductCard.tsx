'use client';

import { Star, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/lib/api';

export default function ProductCard({ product }: { product: Product }) {
  const [addedToCart, setAddedToCart] = useState(false);

  // Normalize image URL: replace absolute localhost with relative path for proxy
  const normalizeImageUrl = (url: string) => {
    if (!url) return '/placeholder.png';
    return url.replace(/^https?:\/\/localhost:\d+/, '');
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.floor(rating)
              ? 'fill-star text-star'
              : star - 0.5 <= rating
              ? 'fill-star/50 text-star'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <article className="product-card group relative flex flex-col overflow-hidden rounded-2xl border border-border-color bg-white fade-in">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-6">
        <img
          src={normalizeImageUrl(product.image)}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Out of stock overlay */}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-sm">
            <span className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
              Sold Out
            </span>
          </div>
        )}
        {/* Deal badge */}
        {product.hotDeal && product.available && (
          <div className="absolute left-3 top-3">
            <span className="rounded-lg bg-orange-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              🔥 Hot
            </span>
          </div>
        )}
        {!product.hotDeal && product.price < 100 && product.available && (
          <div className="absolute left-3 top-3">
            <span className="rounded-lg bg-danger px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Deal
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category tag */}
        <span className="mb-1.5 w-fit rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-text-primary group-hover:text-cta transition-colors cursor-pointer">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1.5">
          {renderStars(product.rating)}
          <span className="text-xs font-medium text-text-muted">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="mb-1 mt-auto">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs text-text-muted">$</span>
            <span className="text-xl font-bold text-text-primary">
              {Math.floor(product.price)}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {(product.price % 1).toFixed(2).substring(1)}
            </span>
          </div>
        </div>

        {/* Stock status */}
        <p className={`mb-3 text-xs font-medium ${product.available ? 'text-success' : 'text-danger'}`}>
          {product.available
            ? product.stock > 0 && product.stock < 10
              ? `Only ${product.stock} left`
              : 'In Stock'
            : 'Currently unavailable'}
        </p>

        {/* Add to cart button */}
        <button
          id={`add-to-cart-${product._id || product.id}`}
          type="button"
          onClick={handleAddToCart}
          disabled={!product.available}
          className={`btn-press w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all ${
            addedToCart
              ? 'bg-success text-white'
              : product.available
              ? 'cta-gradient text-white hover:shadow-md hover:shadow-cta/20'
              : 'cursor-not-allowed bg-gray-100 text-gray-400'
          }`}
        >
          {addedToCart ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" /> Added!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
