'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { watchAuth } from '@/lib/auth';
import { subscribeToProducts } from '@/lib/catalog';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import ProductForm from '@/components/ProductForm';
import type { Product } from '@/types/product';

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const unsub = watchAuth((u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToProducts(setCatalog);
    return () => unsub();
  }, [user]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase text-accent">Loading…</p>
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  if (view === 'form') {
    return (
      <ProductForm
        product={editingProduct}
        onCancel={() => setView('dashboard')}
        onSaved={() => setView('dashboard')}
      />
    );
  }

  return (
    <AdminDashboard
      catalog={catalog}
      onAddNew={() => {
        setEditingProduct(null);
        setView('form');
      }}
      onEdit={(p) => {
        setEditingProduct(p);
        setView('form');
      }}
    />
  );
}
