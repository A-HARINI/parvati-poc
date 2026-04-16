'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Pencil, Trash2, LogOut, Package, Search, X, Save,
  ChevronLeft, ChevronRight, LayoutDashboard, ShoppingBag,
  BarChart3, Star, DollarSign, Tag, AlertTriangle, Upload,
  FolderOpen, Image as ImageIcon, CheckSquare, Square, MinusSquare,
} from 'lucide-react';
import type { Product } from '@/lib/api';

const API_BASE = '';

/* ─── Types ─── */
interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

interface ProductForm {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  rating: string;
  available: boolean;
  hotDeal: boolean;
  image: string;
  images: string[];
  stock: string;
}

const emptyForm: ProductForm = {
  name: '', description: '', category: '', brand: '', price: '', rating: '0',
  available: true, hotDeal: false, image: '', images: [], stock: '0',
};

/* ─────────────────────── COMPONENT ─────────────────────── */
export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories'>('dashboard');

  // Product modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<string>('category');
  const [bulkEditValue, setBulkEditValue] = useState<string>('');
  const [bulkSaving, setBulkSaving] = useState(false);

  // Stats
  const [stats, setStats] = useState({ total: 0, inStock: 0, outOfStock: 0, categories: 0, avgPrice: 0, avgRating: 0 });

  // Categories
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catMode, setCatMode] = useState<'create' | 'edit'>('create');
  const [catEditId, setCatEditId] = useState('');
  const [catForm, setCatForm] = useState({ name: '', description: '', image: '', isActive: true });
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState('');
  const [catDeleteConfirm, setCatDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { window.location.href = '/admin'; return; }
    setToken(t);
  }, []);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  /* ─── Products fetch ─── */
  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', '10');
      params.set('sort', 'newest');
      const res = await fetch(`${API_BASE}/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      }
    } catch (err) { console.error('Failed to fetch products:', err); }
    finally { setLoading(false); }
  }, [token, search, page]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/products?limit=1000`);
      if (res.ok) {
        const data = await res.json();
        const all: Product[] = data.products;
        const cats = new Set(all.map((p) => p.category));
        setStats({
          total: data.total,
          inStock: all.filter((p) => p.available).length,
          outOfStock: all.filter((p) => !p.available).length,
          categories: cats.size,
          avgPrice: all.length ? Math.round(all.reduce((s, p) => s + p.price, 0) / all.length) : 0,
          avgRating: all.length ? +(all.reduce((s, p) => s + p.rating, 0) / all.length).toFixed(1) : 0,
        });
      }
    } catch { /* ignore */ }
  }, [token]);

  /* ─── Categories fetch ─── */
  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setCatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch { /* ignore */ }
    finally { setCatLoading(false); }
  }, [token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 400); return () => clearTimeout(t); }, [search]);
  useEffect(() => { setPage(1); fetchProducts(); }, [debouncedSearch]);

  const handleLogout = () => { localStorage.removeItem('admin_token'); window.location.href = '/admin'; };

  /* ─── Product modals ─── */
  const openCreateModal = () => {
    setForm({ ...emptyForm, category: categories.length > 0 ? categories[0].name : '' });
    setModalMode('create');
    setEditingId('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      brand: (product as any).brand || '',
      price: String(product.price),
      rating: String(product.rating),
      available: product.available,
      hotDeal: (product as any).hotDeal || false,
      image: product.image || '',
      images: (product as any).images || [],
      stock: String(product.stock || 0),
    });
    setModalMode('edit');
    setEditingId(product._id || product.id);
    setFormError('');
    setModalOpen(true);
  };

  /* ─── Image upload ─── */
  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('images', f));

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const fullUrls = data.urls.map((u: string) => `${API_BASE}${u}`);
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...fullUrls],
          image: prev.image || fullUrls[0],
        }));
      } else {
        const err = await res.json();
        setFormError(err.message || 'Upload failed');
      }
    } catch { setFormError('Upload failed'); }
    finally { setUploading(false); }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== idx);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : prev.image,
      };
    });
  };

  /* ─── Save product ─── */
  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { setFormError('Name and price are required'); return; }
    setSaving(true);
    setFormError('');

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      brand: form.brand.trim(),
      price: parseFloat(form.price),
      rating: parseFloat(form.rating) || 0,
      available: form.available,
      hotDeal: form.hotDeal,
      image: form.image.trim() || (form.images.length > 0 ? form.images[0] : ''),
      images: form.images,
      stock: parseInt(form.stock) || 0,
    };

    try {
      const url = modalMode === 'create' ? `${API_BASE}/api/products` : `${API_BASE}/api/products/${editingId}`;
      const res = await fetch(url, {
        method: modalMode === 'create' ? 'POST' : 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) { const err = await res.json(); setFormError(err.message || 'Failed to save'); setSaving(false); return; }
      setModalOpen(false);
      fetchProducts();
      fetchStats();
    } catch { setFormError('Failed to connect to server'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) { setDeleteConfirm(null); fetchProducts(); fetchStats(); }
    } catch { /* ignore */ }
    finally { setDeleting(false); }
  };

  /* ─── Bulk operations ─── */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p._id || p.id)));
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/bulk-delete`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setBulkDeleteConfirm(false);
        setSelectedIds(new Set());
        fetchProducts();
        fetchStats();
      }
    } catch { /* ignore */ }
    finally { setBulkDeleting(false); }
  };

  const handleBulkEdit = async () => {
    if (!bulkEditValue && bulkEditField !== 'available') return;
    setBulkSaving(true);
    try {
      let value: unknown = bulkEditValue;
      if (bulkEditField === 'available') value = bulkEditValue === 'true';
      else if (bulkEditField === 'price' || bulkEditField === 'stock' || bulkEditField === 'rating') value = Number(bulkEditValue);

      const res = await fetch(`${API_BASE}/api/products/bulk-update`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ ids: Array.from(selectedIds), update: { [bulkEditField]: value } }),
      });
      if (res.ok) {
        setBulkEditOpen(false);
        setSelectedIds(new Set());
        setBulkEditValue('');
        fetchProducts();
        fetchStats();
      }
    } catch { /* ignore */ }
    finally { setBulkSaving(false); }
  };

  const updateForm = (key: keyof ProductForm, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ─── Category CRUD ─── */
  const openCatCreate = () => {
    setCatForm({ name: '', description: '', image: '', isActive: true });
    setCatMode('create');
    setCatEditId('');
    setCatError('');
    setCatModalOpen(true);
  };

  const openCatEdit = (cat: CategoryItem) => {
    setCatForm({ name: cat.name, description: cat.description, image: cat.image, isActive: cat.isActive });
    setCatMode('edit');
    setCatEditId(cat._id);
    setCatError('');
    setCatModalOpen(true);
  };

  const handleCatSave = async () => {
    if (!catForm.name.trim()) { setCatError('Category name is required'); return; }
    setCatSaving(true);
    setCatError('');
    try {
      const url = catMode === 'create' ? `${API_BASE}/api/categories` : `${API_BASE}/api/categories/${catEditId}`;
      const res = await fetch(url, {
        method: catMode === 'create' ? 'POST' : 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(catForm),
      });
      if (!res.ok) { const err = await res.json(); setCatError(err.message || 'Failed to save'); setCatSaving(false); return; }
      setCatModalOpen(false);
      fetchCategories();
    } catch { setCatError('Failed to connect'); }
    finally { setCatSaving(false); }
  };

  const handleCatDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) { setCatDeleteConfirm(null); fetchCategories(); }
    } catch { /* ignore */ }
  };

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-[240px] flex-col text-white" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <a href="/" className="flex items-center">
            <img src="/logo-white.webp" alt="Parvati" className="h-8 w-auto" />
          </a>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {[
            { key: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
            { key: 'products' as const, icon: ShoppingBag, label: 'Products' },
            { key: 'categories' as const, icon: FolderOpen, label: 'Categories' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.key ? 'text-gray-900' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              style={activeTab === tab.key ? { backgroundColor: '#fbef00', color: '#1a1a2e' } : {}}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[240px] flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'products' ? 'Product Management' : 'Category Management'}
            </h1>
            <p className="text-sm text-text-secondary">
              {activeTab === 'dashboard' ? 'Overview of your store' : activeTab === 'products' ? 'Manage your product catalog' : 'Manage product categories'}
            </p>
          </div>
          {activeTab === 'products' && (
            <button onClick={openCreateModal} className="btn-press flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md" style={{ background: 'linear-gradient(135deg, #1793e7, #1279c4)' }}>
              <Plus className="h-4 w-4" /> Add Product
            </button>
          )}
          {activeTab === 'categories' && (
            <button onClick={openCatCreate} className="btn-press flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md" style={{ background: 'linear-gradient(135deg, #1793e7, #1279c4)' }}>
              <Plus className="h-4 w-4" /> Add Category
            </button>
          )}
        </div>

        {/* ═══ DASHBOARD TAB ═══ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 fade-in">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[
                { label: 'Total Products', value: stats.total, icon: Package, color: 'bg-blue-500' },
                { label: 'In Stock', value: stats.inStock, icon: ShoppingBag, color: 'bg-green-500' },
                { label: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, color: 'bg-red-500' },
                { label: 'Categories', value: categories.length, icon: Tag, color: 'bg-purple-500' },
                { label: 'Avg Price', value: `$${stats.avgPrice}`, icon: DollarSign, color: 'bg-amber-500' },
                { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: 'bg-orange-500' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-text-primary">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg ${stat.color} p-2.5`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-soft">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                  <BarChart3 className="h-5 w-5 text-text-muted" /> Recent Products
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                      <th className="px-6 py-3">Product</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Rating</th><th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((p) => (
                      <tr key={p._id || p.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-3"><div className="flex items-center gap-3">{p.image && <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}<span className="text-sm font-medium text-text-primary">{p.name}</span></div></td>
                        <td className="px-6 py-3"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-secondary">{p.category}</span></td>
                        <td className="px-6 py-3 text-sm font-medium text-text-primary">${p.price.toFixed(2)}</td>
                        <td className="px-6 py-3"><div className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-star text-star" /> {p.rating}</div></td>
                        <td className="px-6 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.available ? 'In Stock' : 'Out of Stock'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PRODUCTS TAB ═══ */}
        {activeTab === 'products' && (
          <div className="fade-in">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-border-color bg-white pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" />
              </div>
              <span className="text-sm text-text-secondary">{total} products</span>
            </div>

            {/* Bulk action bar */}
            {selectedIds.size > 0 && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 fade-in">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">{selectedIds.size} product{selectedIds.size > 1 ? 's' : ''} selected</span>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => setBulkEditOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">
                    <Pencil className="h-3.5 w-3.5" /> Bulk Edit
                  </button>
                  <button onClick={() => setBulkDeleteConfirm(true)} className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" /> Delete Selected
                  </button>
                  <button onClick={() => setSelectedIds(new Set())} className="rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-100" title="Clear selection">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                      <th className="px-3 py-3 w-10">
                        <button onClick={toggleSelectAll} className="text-text-muted hover:text-text-primary transition">
                          {products.length > 0 && selectedIds.size === products.length ? <CheckSquare className="h-4 w-4 text-blue-600" /> : selectedIds.size > 0 ? <MinusSquare className="h-4 w-4 text-blue-600" /> : <Square className="h-4 w-4" />}
                        </button>
                      </th>
                      <th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Images</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="px-3 py-4"><div className="h-4 w-4 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-48 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-20 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-16 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-10 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-10 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-16 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-20 rounded shimmer ml-auto" /></td>
                        </tr>
                      ))
                    ) : products.length === 0 ? (
                      <tr><td colSpan={8} className="px-5 py-12 text-center text-text-muted"><Package className="mx-auto mb-3 h-12 w-12 text-text-muted/40" /><p className="text-sm">No products found</p></td></tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id || product.id} className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${selectedIds.has(product._id || product.id) ? 'bg-blue-50/50' : ''}`}>
                          <td className="px-3 py-3">
                            <button onClick={() => toggleSelect(product._id || product.id)} className="text-text-muted hover:text-text-primary transition">
                              {selectedIds.has(product._id || product.id) ? <CheckSquare className="h-4 w-4 text-blue-600" /> : <Square className="h-4 w-4" />}
                            </button>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {product.image ? <img src={product.image} alt="" className="h-11 w-11 rounded-lg border border-gray-100 object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100"><Package className="h-5 w-5 text-text-muted" /></div>}
                              <div><p className="text-sm font-medium text-text-primary line-clamp-1">{product.name}</p><p className="text-xs text-text-muted line-clamp-1">{product.description}</p></div>
                            </div>
                          </td>
                          <td className="px-5 py-3"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-secondary">{product.category}</span></td>
                          <td className="px-5 py-3 text-sm font-semibold text-text-primary">${product.price.toFixed(2)}</td>
                          <td className="px-5 py-3 text-sm text-text-secondary">{product.stock || 0}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <ImageIcon className="h-3.5 w-3.5 text-text-muted" />
                              <span className="text-xs text-text-secondary">{((product as any).images?.length || 0) + (product.image ? 1 : 0)}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.available ? 'In Stock' : 'Out of Stock'}</span></td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => openEditModal(product)} className="rounded-lg p-2 text-text-muted transition hover:bg-blue-50 hover:text-blue-600" title="Edit"><Pencil className="h-4 w-4" /></button>
                              <button onClick={() => setDeleteConfirm(product._id || product.id)} className="rounded-lg p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {pages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
                  <p className="text-sm text-text-secondary">Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-border-color p-2 text-text-primary transition hover:bg-gray-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                    <span className="px-3 text-sm font-medium text-text-primary">{page} / {pages}</span>
                    <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} className="rounded-lg border border-border-color p-2 text-text-primary transition hover:bg-gray-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ CATEGORIES TAB ═══ */}
        {activeTab === 'categories' && (
          <div className="fade-in">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                      <th className="px-5 py-3">Category</th><th className="px-5 py-3">Slug</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="px-5 py-4"><div className="h-5 w-32 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-24 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-48 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-16 rounded shimmer" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-20 rounded shimmer ml-auto" /></td>
                        </tr>
                      ))
                    ) : categories.length === 0 ? (
                      <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted"><FolderOpen className="mx-auto mb-3 h-12 w-12 text-text-muted/40" /><p className="text-sm">No categories yet</p><p className="text-xs mt-1">Click &quot;Add Category&quot; to create one</p></td></tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat._id} className="border-b border-gray-50 transition-colors hover:bg-gray-50">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {cat.image ? <img src={cat.image} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: '#fbef00' }}><FolderOpen className="h-5 w-5" style={{ color: '#1a1a2e' }} /></div>}
                              <span className="text-sm font-semibold text-text-primary">{cat.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3"><span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-mono text-text-secondary">{cat.slug}</span></td>
                          <td className="px-5 py-3 text-sm text-text-secondary line-clamp-1">{cat.description || '—'}</td>
                          <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span></td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => openCatEdit(cat)} className="rounded-lg p-2 text-text-muted transition hover:bg-blue-50 hover:text-blue-600" title="Edit"><Pencil className="h-4 w-4" /></button>
                              <button onClick={() => setCatDeleteConfirm(cat._id)} className="rounded-lg p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══ PRODUCT MODAL ═══ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl fade-in max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-text-primary">{modalMode === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-text-muted hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="overflow-y-auto px-6 py-4 flex-1">
              {formError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">{formError}</div>}

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">Product Name *</label>
                  <input type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder="e.g. Sony WH-1000XM5" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">Description</label>
                  <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={3} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20 resize-none" placeholder="Product description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text-primary">Category *</label>
                    <select value={form.category} onChange={(e) => updateForm('category', e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20">
                      {categories.length === 0 ? <option>No categories</option> : categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text-primary">Brand</label>
                    <input type="text" value={form.brand} onChange={(e) => updateForm('brand', e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder="e.g. Sony, Apple" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text-primary">Price *</label>
                    <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => updateForm('price', e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder="99.99" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text-primary">Rating (0–5)</label>
                    <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => updateForm('rating', e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text-primary">Stock</label>
                    <input type="number" min="0" value={form.stock} onChange={(e) => updateForm('stock', e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" />
                  </div>
                </div>

                {/* Image Gallery Upload */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">Product Images</label>
                  <div className="rounded-xl border-2 border-dashed border-border-color p-4 transition hover:border-cta/40">
                    {form.images.length > 0 && (
                      <div className="mb-3 grid grid-cols-4 gap-2">
                        {form.images.map((img, idx) => (
                          <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button onClick={() => removeImage(idx)} className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 transition group-hover:opacity-100"><X className="h-3 w-3" /></button>
                            {idx === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white">Main</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) handleImageUpload(e.target.files); e.target.value = ''; }} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-color bg-white py-2.5 text-sm font-medium text-text-secondary transition hover:bg-gray-50 disabled:opacity-50">
                      {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-cta border-t-transparent" /> : <Upload className="h-4 w-4" />}
                      {uploading ? 'Uploading...' : 'Upload Images'}
                    </button>
                    <p className="mt-1.5 text-center text-xs text-text-muted">JPEG, PNG, WebP up to 5MB each · Max 10 images</p>
                  </div>
                </div>

                {/* Or Image URL */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-primary">Or Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => updateForm('image', e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder="https://..." />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="available" checked={form.available} onChange={(e) => updateForm('available', e.target.checked)} className="h-4 w-4 rounded" style={{ accentColor: '#1793e7' }} />
                  <label htmlFor="available" className="text-sm font-medium text-text-primary">Available (In Stock)</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="hotDeal" checked={form.hotDeal} onChange={(e) => updateForm('hotDeal', e.target.checked)} className="h-4 w-4 rounded" style={{ accentColor: '#f97316' }} />
                  <label htmlFor="hotDeal" className="text-sm font-medium text-text-primary">🔥 Hot Deal</label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-border-color px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-press flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #1793e7, #1279c4)' }}>
                {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
                {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CATEGORY MODAL ═══ */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay" onClick={() => setCatModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-text-primary">{catMode === 'create' ? 'Add Category' : 'Edit Category'}</h2>
              <button onClick={() => setCatModalOpen(false)} className="rounded-lg p-1 text-text-muted hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {catError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">{catError}</div>}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">Category Name *</label>
                <input type="text" value={catForm.name} onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder="e.g. Electronics" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">Description</label>
                <textarea value={catForm.description} onChange={(e) => setCatForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20 resize-none" placeholder="Optional description..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">Image URL</label>
                <input type="url" value={catForm.image} onChange={(e) => setCatForm((p) => ({ ...p, image: e.target.value }))} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="catActive" checked={catForm.isActive} onChange={(e) => setCatForm((p) => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4 rounded" style={{ accentColor: '#1793e7' }} />
                <label htmlFor="catActive" className="text-sm font-medium text-text-primary">Active</label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button onClick={() => setCatModalOpen(false)} className="rounded-xl border border-border-color px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-gray-50">Cancel</button>
              <button onClick={handleCatSave} disabled={catSaving} className="btn-press flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #1793e7, #1279c4)' }}>
                {catSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
                {catMode === 'create' ? 'Create Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE PRODUCT CONFIRM ═══ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2.5"><Trash2 className="h-5 w-5 text-red-600" /></div>
              <div><h3 className="text-lg font-bold text-text-primary">Delete Product</h3><p className="text-sm text-text-secondary">This action cannot be undone.</p></div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-border-color px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting} className="btn-press flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                {deleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE CATEGORY CONFIRM ═══ */}
      {catDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay" onClick={() => setCatDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2.5"><Trash2 className="h-5 w-5 text-red-600" /></div>
              <div><h3 className="text-lg font-bold text-text-primary">Delete Category</h3><p className="text-sm text-text-secondary">This will permanently remove this category.</p></div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setCatDeleteConfirm(null)} className="rounded-lg border border-border-color px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleCatDelete(catDeleteConfirm)} className="btn-press flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BULK DELETE CONFIRM ═══ */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay" onClick={() => setBulkDeleteConfirm(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2.5"><Trash2 className="h-5 w-5 text-red-600" /></div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Delete {selectedIds.size} Product{selectedIds.size > 1 ? 's' : ''}</h3>
                <p className="text-sm text-text-secondary">This action cannot be undone. All selected products will be permanently removed.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setBulkDeleteConfirm(false)} className="rounded-lg border border-border-color px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-50">Cancel</button>
              <button onClick={handleBulkDelete} disabled={bulkDeleting} className="btn-press flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                {bulkDeleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Trash2 className="h-4 w-4" />}
                Delete {selectedIds.size} Product{selectedIds.size > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BULK EDIT MODAL ═══ */}
      {bulkEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay" onClick={() => setBulkEditOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-text-primary">Bulk Edit {selectedIds.size} Product{selectedIds.size > 1 ? 's' : ''}</h2>
              <button onClick={() => setBulkEditOpen(false)} className="rounded-lg p-1 text-text-muted hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">Field to Update</label>
                <select value={bulkEditField} onChange={(e) => { setBulkEditField(e.target.value); setBulkEditValue(''); }} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20">
                  <option value="category">Category</option>
                  <option value="brand">Brand</option>
                  <option value="available">Availability</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">New Value</label>
                {bulkEditField === 'category' ? (
                  <select value={bulkEditValue} onChange={(e) => setBulkEditValue(e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20">
                    <option value="">Select category...</option>
                    {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                  </select>
                ) : bulkEditField === 'available' ? (
                  <select value={bulkEditValue} onChange={(e) => setBulkEditValue(e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20">
                    <option value="">Select...</option>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                ) : bulkEditField === 'price' || bulkEditField === 'stock' ? (
                  <input type="number" min="0" step={bulkEditField === 'price' ? '0.01' : '1'} value={bulkEditValue} onChange={(e) => setBulkEditValue(e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder={bulkEditField === 'price' ? '99.99' : '0'} />
                ) : bulkEditField === 'rating' ? (
                  <input type="number" min="0" max="5" step="0.1" value={bulkEditValue} onChange={(e) => setBulkEditValue(e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder="0-5" />
                ) : (
                  <input type="text" value={bulkEditValue} onChange={(e) => setBulkEditValue(e.target.value)} className="w-full rounded-xl border border-border-color px-3.5 py-2.5 text-sm outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20" placeholder={`Enter ${bulkEditField}...`} />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button onClick={() => setBulkEditOpen(false)} className="rounded-xl border border-border-color px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-gray-50">Cancel</button>
              <button onClick={handleBulkEdit} disabled={bulkSaving || (!bulkEditValue && bulkEditField !== 'available')} className="btn-press flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #1793e7, #1279c4)' }}>
                {bulkSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
                Update {selectedIds.size} Product{selectedIds.size > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
