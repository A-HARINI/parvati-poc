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
    <article className="product-card group relative flex flex-col overflow-hidden rounded-2xl border border-border-color bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 fade-in">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-gray-50 to-white p-5">
        <img
          src={normalizeImageUrl(product.image)}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Out of stock overlay */}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <span className="rounded-full bg-gray-900 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Sold Out
            </span>
          </div>
        )}
        {/* Hot badge */}
        {product.hotDeal && product.available && (
          <div className="absolute left-3 top-3">
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
              🔥 Hot Deal
            </span>
          </div>
        )}
        {/* Deal badge */}
        {!product.hotDeal && product.price < 100 && product.available && (
          <div className="absolute left-3 top-3">
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
              Deal
            </span>
          </div>
        )}
        {/* Quick cart on hover */}
        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={!product.available}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cta text-white shadow-lg transition hover:bg-cta-dark disabled:hidden"
            aria-label="Quick add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Category tag */}
        <span className="mb-2 w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-[13px] font-semibold leading-snug text-text-primary group-hover:text-cta transition-colors cursor-pointer">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1.5">
          {renderStars(product.rating)}
          <span className="text-xs text-text-muted">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price & Stock */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs text-text-muted">$</span>
              <span className="text-xl font-extrabold text-text-primary">
                {Math.floor(product.price)}
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {(product.price % 1).toFixed(2).substring(1)}
              </span>
            </div>
            <p className={`mt-0.5 text-[11px] font-semibold ${product.available ? 'text-success' : 'text-danger'}`}>
              {product.available
                ? product.stock > 0 && product.stock < 10
                  ? `Only ${product.stock} left!`
                  : '✓ In Stock'
                : 'Unavailable'}
            </p>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          id={`add-to-cart-${product._id || product.id}`}
          type="button"
          onClick={handleAddToCart}
          disabled={!product.available}
          className={`mt-3 btn-press w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            addedToCart
              ? 'bg-success text-white shadow-sm'
              : product.available
              ? 'bg-gray-900 text-white hover:bg-cta hover:shadow-md'
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
