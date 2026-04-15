'use client';

import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react';

interface NavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartCount?: number;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function Navbar({ searchValue, onSearchChange, cartCount = 0, categories = [], selectedCategory = 'All', onCategoryChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <>
      {/* Main header — white with yellow accent stripe */}
      <header className="sticky top-0 z-50 bg-white shadow-nav">
        {/* Yellow accent line */}
        <div className="h-1 primary-gradient" />

        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-text-primary transition hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <a href="/" id="logo-link" className="flex flex-shrink-0 items-center">
            <img src="/logo-black.png" alt="Parvati" className="h-9 w-auto" />
          </a>

          {/* Categories dropdown — desktop */}
          <div className="hidden items-center lg:flex">
            <button className="flex items-center gap-1 rounded-xl border border-border-color px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-50 hover:border-gray-300">
              Categories <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            </button>
          </div>

          {/* Search bar — centered */}
          <div className="relative flex flex-1 mx-1 sm:mx-3 max-w-2xl">
            <div className={`flex w-full overflow-hidden rounded-xl border-2 transition-all ${searchFocused ? 'border-cta shadow-glow' : 'border-border-color'}`}>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="search-input"
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search products, categories..."
                aria-label="Search products"
                className="w-full border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <button
                id="search-btn"
                className="flex items-center justify-center bg-cta px-4 text-white transition-colors hover:bg-cta-dark"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Account */}
            <a
              href="/admin"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-100 lg:flex"
            >
              <User className="h-4 w-4 text-text-muted" />
              <span>Account</span>
            </a>

            {/* Cart */}
            <button
              id="cart-btn"
              className="relative flex items-center gap-2 rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cta-dark"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-nav-dark">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sub-navigation — categories bar */}
        <div className="border-t border-border-color bg-white">
          <div className="mx-auto flex max-w-[1440px] items-center gap-1 overflow-x-auto px-4 py-1.5 text-sm sm:px-6 scrollbar-none">
            {['All', ...categories].map((item) => (
              <button
                key={item}
                onClick={() => onCategoryChange?.(item)}
                className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  selectedCategory === item
                    ? 'bg-primary/20 font-semibold text-text-primary'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
              >
                {item === 'All' ? 'All Products' : item}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-[300px] bg-white slide-in-left overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between primary-gradient px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-sm font-bold text-nav-dark">P</div>
                <span className="text-lg font-bold text-nav-dark">Parvati</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1 text-nav-dark/70 hover:bg-white/20"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu items */}
            <div className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">Shop By Category</p>
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-100 ${
                    selectedCategory === cat ? 'font-semibold text-text-primary bg-primary/10' : 'text-text-primary'
                  }`}
                  onClick={() => { onCategoryChange?.(cat); setMobileMenuOpen(false); }}
                >
                  {cat}
                </button>
              ))}
              <div className="my-3 border-t border-border-color" />
              <a
                href="/admin"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-text-primary transition-colors hover:bg-gray-100"
              >
                <User className="h-4 w-4 text-text-muted" /> Admin Login
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
