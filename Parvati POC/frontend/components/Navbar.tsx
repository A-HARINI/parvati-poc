'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { fetchSearchSuggestions, type SearchSuggestion } from '@/lib/api';

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
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const API_BASE = '';

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setCategorySuggestions([]);
      setShowDropdown(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchSearchSuggestions(query);
      setSuggestions(data.products);
      setCategorySuggestions(data.categories);
      setShowDropdown(data.products.length > 0 || data.categories.length > 0);
      setHighlightIndex(-1);
    } catch {
      setSuggestions([]);
      setCategorySuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(searchValue), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchValue, fetchSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setShowDropdown(false);
    onSearchChange(query);
  };

  const handleSelectProduct = (product: SearchSuggestion) => {
    setShowDropdown(false);
    onSearchChange(product.name);
  };

  const handleSelectCategory = (category: string) => {
    setShowDropdown(false);
    onSearchChange('');
    onCategoryChange?.(category);
  };

  const allItems = [
    ...categorySuggestions.map((c) => ({ type: 'category' as const, value: c })),
    ...suggestions.map((p) => ({ type: 'product' as const, value: p })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || allItems.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(searchValue);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < allItems.length) {
          const item = allItems[highlightIndex];
          if (item.type === 'category') {
            handleSelectCategory(item.value as string);
          } else {
            handleSelectProduct(item.value as SearchSuggestion);
          }
        } else {
          handleSearch(searchValue);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

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
          <div className="relative flex flex-1 mx-1 sm:mx-3 max-w-2xl" ref={dropdownRef}>
            <div className={`flex w-full overflow-hidden rounded-xl border-2 transition-all ${searchFocused ? 'border-cta shadow-glow' : 'border-border-color'}`}>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted z-10" />
              <input
                ref={inputRef}
                id="search-input"
                type="text"
                autoComplete="off"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true);
                  if (searchValue.trim().length >= 2 && (suggestions.length > 0 || categorySuggestions.length > 0)) {
                    setShowDropdown(true);
                  }
                }}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, categories..."
                aria-label="Search products"
                aria-expanded={showDropdown}
                aria-autocomplete="list"
                className="w-full border-0 bg-transparent py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <button
                id="search-btn"
                onClick={() => handleSearch(searchValue)}
                className="flex items-center justify-center bg-cta px-4 text-white transition-colors hover:bg-cta-dark"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[420px] overflow-y-auto rounded-xl border border-border-color bg-white shadow-xl">
                {/* Category suggestions */}
                {categorySuggestions.length > 0 && (
                  <div className="border-b border-border-color px-3 py-2">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Categories</p>
                    {categorySuggestions.map((cat, idx) => {
                      const itemIdx = idx;
                      return (
                        <button
                          key={cat}
                          onMouseDown={(e) => { e.preventDefault(); handleSelectCategory(cat); }}
                          onMouseEnter={() => setHighlightIndex(itemIdx)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                            highlightIndex === itemIdx ? 'bg-primary/10 text-text-primary' : 'text-text-secondary hover:bg-gray-50'
                          }`}
                        >
                          <Search className="h-3.5 w-3.5 flex-shrink-0 text-text-muted" />
                          <span>
                            in <span className="font-semibold text-text-primary">{cat}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Product suggestions */}
                {suggestions.length > 0 && (
                  <div className="px-3 py-2">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Products</p>
                    {suggestions.map((product, idx) => {
                      const itemIdx = categorySuggestions.length + idx;
                      return (
                        <button
                          key={product.id}
                          onMouseDown={(e) => { e.preventDefault(); handleSelectProduct(product); }}
                          onMouseEnter={() => setHighlightIndex(itemIdx)}
                          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                            highlightIndex === itemIdx ? 'bg-primary/10' : 'hover:bg-gray-50'
                          }`}
                        >
                          {product.image ? (
                            <img
                              src={product.image.startsWith('http') ? product.image : `${API_BASE}${product.image}`}
                              alt={product.name}
                              className="h-10 w-10 flex-shrink-0 rounded-lg border border-border-color object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-text-muted">
                              <Search className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-text-primary">{product.name}</p>
                            <p className="text-xs text-text-muted">
                              {product.brand && <span>{product.brand} · </span>}
                              {product.category}
                            </p>
                          </div>
                          <span className="flex-shrink-0 text-sm font-semibold text-cta">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Search for full text */}
                {searchValue.trim() && (
                  <div className="border-t border-border-color px-3 py-2">
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleSearch(searchValue); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-cta transition-colors hover:bg-primary/10"
                    >
                      <Search className="h-3.5 w-3.5" />
                      Search for &quot;{searchValue}&quot;
                    </button>
                  </div>
                )}
              </div>
            )}
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
