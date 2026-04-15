'use client';

import { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = '';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      window.location.href = '/admin/dashboard';
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', data.token);
      window.location.href = '/admin/dashboard';
    } catch {
      setError('Failed to connect to server');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-extrabold text-nav-dark text-xl shadow-sm">
              P
            </div>
            <span className="text-2xl font-bold text-text-primary">Parvati</span>
            <span className="text-sm text-text-muted">.shop</span>
          </a>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border-color bg-white p-8 shadow-card">
          <h1 className="mb-1 text-2xl font-bold text-text-primary">Admin Sign-In</h1>
          <p className="mb-6 text-sm text-text-muted">Enter your credentials to manage products</p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-text-primary" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl border border-border-color px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                placeholder="Enter admin username"
              />
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-semibold text-text-primary" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border-color px-4 py-2.5 pr-10 text-sm text-text-primary outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press flex w-full items-center justify-center gap-2 rounded-xl cta-gradient px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border-color pt-4">
            <p className="text-center text-xs text-text-muted">
              Admin access only. Visit{' '}
              <a href="/" className="text-cta hover:text-cta-dark hover:underline">
                Parvati.shop
              </a>{' '}
              to browse the store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
