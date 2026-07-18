'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, LogOut, ImageOff } from 'lucide-react';
import { formatNaira, STORE_NAME } from '@/lib/config';
import { deleteProduct, toggleStock } from '@/lib/catalog';
import { signOutAdmin } from '@/lib/auth';
import type { Product } from '@/types/product';

const GLOSSY = '0 1px 2px rgba(43,36,25,0.10), inset 0 1px 0 rgba(255,255,255,0.35)';
const SOFT_SHADOW = '0 1px 3px rgba(43,36,25,0.08)';
const SATIN_BTN = 'linear-gradient(120deg, #6B3F2A 0%, #C9853F 50%, #6B3F2A 100%)';

export default function AdminDashboard({
  catalog,
  onAddNew,
  onEdit,
}: {
  catalog: Product[];
  onAddNew: () => void;
  onEdit: (product: Product) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bg text-ink pb-10">
      <header className="px-5 pt-8 pb-5 flex items-center justify-between border-b border-border">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Dashboard</p>
          <h2 className="font-display text-2xl font-semibold">{STORE_NAME}</h2>
        </div>
        <button onClick={() => signOutAdmin()} className="flex items-center gap-1 text-xs text-muted">
          <LogOut size={14} /> Log out
        </button>
      </header>

      <div className="px-5 mt-5">
        <button
          onClick={onAddNew}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-onAccent"
          style={{ background: SATIN_BTN, boxShadow: GLOSSY }}
        >
          <Plus size={16} /> Add new perfume
        </button>
      </div>

      <div className="px-5 mt-6 space-y-3">
        {catalog.length === 0 && (
          <p className="text-sm text-center py-10 text-muted">No perfumes yet. Add your first one above.</p>
        )}
        {catalog.map((p) => (
          <div key={p.id} className="rounded-xl p-3 flex gap-3 bg-surface border border-border" style={{ boxShadow: SOFT_SHADOW }}>
            <div className="w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-surfaceAlt">
              {p.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photoUrl} className="w-full h-full object-cover" alt={p.name} />
              ) : (
                <ImageOff size={18} className="text-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{p.name}</p>
              <p className="text-xs text-accent">
                {p.variants.map((v) => `${v.label} ${formatNaira(v.price)}`).join(' · ')}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  onClick={() => toggleStock(p.id, p.inStock)}
                  className={`text-xs flex items-center gap-1 ${p.inStock === false ? 'text-alert' : 'text-muted'}`}
                >
                  <Check size={12} /> {p.inStock === false ? 'Sold out' : 'In stock'}
                </button>
                <button onClick={() => onEdit(p)} className="text-xs flex items-center gap-1 text-muted">
                  <Pencil size={12} /> Edit
                </button>
                {confirmDelete === p.id ? (
                  <button onClick={() => deleteProduct(p.id)} className="text-xs font-semibold text-alert">
                    Confirm delete
                  </button>
                ) : (
                  <button onClick={() => setConfirmDelete(p.id)} className="text-xs flex items-center gap-1 text-muted">
                    <Trash2 size={12} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
