'use client';

import { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { addProduct, updateProduct } from '@/lib/catalog';
import { compressImage, uploadProductPhoto } from '@/lib/storage';
import type { Product, Variant } from '@/types/product';

const GLOSSY = '0 1px 2px rgba(43,36,25,0.10), inset 0 1px 0 rgba(255,255,255,0.35)';
const SATIN_BTN = 'linear-gradient(120deg, #6B3F2A 0%, #C9853F 50%, #6B3F2A 100%)';

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function ProductForm({
  product,
  onCancel,
  onSaved,
}: {
  product: Product | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.length ? product.variants : [{ id: newId(), label: '', price: 0 }]
  );
  const [deliveryFee, setDeliveryFee] = useState(product?.deliveryFee ? String(product.deliveryFee) : '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(product?.photoUrl || null);
  const [photoFile, setPhotoFile] = useState<string | null>(null); // compressed data URL pending upload
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      setPhotoPreview(compressed);
      setPhotoFile(compressed);
    } catch {
      setError('Could not process that photo. Try a different one.');
    }
    setUploading(false);
  }

  function updateVariant(id: string, field: 'label' | 'price', value: string) {
    setVariants((v) => v.map((x) => (x.id === id ? { ...x, [field]: field === 'price' ? Number(value) : value } : x)));
  }
  function addVariant() {
    setVariants((v) => [...v, { id: newId(), label: '', price: 0 }]);
  }
  function removeVariant(id: string) {
    setVariants((v) => (v.length > 1 ? v.filter((x) => x.id !== id) : v));
  }

  async function handleSave() {
    setError('');
    if (!name.trim()) return setError('Give the perfume a name.');
    const cleanVariants = variants
      .map((v) => ({ ...v, label: v.label.trim(), price: Number(v.price) }))
      .filter((v) => v.label && v.price > 0);
    if (cleanVariants.length === 0) return setError('Add at least one size/variant with a price.');

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        variants: cleanVariants,
        deliveryFee: deliveryFee ? Number(deliveryFee) : 0,
        photoUrl: product?.photoUrl || null,
        inStock: product?.inStock !== false,
      };

      if (product) {
        if (photoFile) {
          const url = await uploadProductPhoto(photoFile, product.id);
          payload.photoUrl = url;
        }
        await updateProduct(product.id, payload);
      } else {
        const id = await addProduct(payload);
        if (photoFile) {
          const url = await uploadProductPhoto(photoFile, id);
          await updateProduct(id, { photoUrl: url });
        }
      }
      onSaved();
    } catch {
      setError('Something went wrong saving this. Try again.');
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-bg text-ink pb-16">
      <header className="px-5 pt-8 pb-5 flex items-center justify-between border-b border-border">
        <h2 className="font-display text-xl font-semibold">{product ? 'Edit perfume' : 'Add new perfume'}</h2>
        <button onClick={onCancel}>
          <X size={20} className="text-muted" />
        </button>
      </header>

      <div className="px-5 mt-5 space-y-5">
        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Photo</label>
          <label className="mt-2 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden bg-surfaceAlt border border-dashed border-border" style={{ height: 160 }}>
            {uploading ? (
              <p className="text-xs text-muted">Processing…</p>
            ) : photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted">
                <Upload size={20} />
                <span className="text-xs">Take or upload a photo</span>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Perfume name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chanel Bleu de Chanel"
            className="w-full mt-2 rounded-lg px-3 py-2.5 text-sm outline-none bg-surface text-ink border border-border"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Notes / description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Fresh, citrus top notes…"
            rows={2}
            className="w-full mt-2 rounded-lg px-3 py-2.5 text-sm outline-none resize-none bg-surface text-ink border border-border"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Sizes / variants &amp; price</label>
          <div className="mt-2 space-y-2">
            {variants.map((v) => (
              <div key={v.id} className="flex gap-2">
                <input
                  value={v.label}
                  onChange={(e) => updateVariant(v.id, 'label', e.target.value)}
                  placeholder="e.g. 30ml"
                  className="flex-1 rounded-lg px-3 py-2 text-sm outline-none bg-surface text-ink border border-border"
                />
                <input
                  value={v.price || ''}
                  onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                  placeholder="Price"
                  inputMode="numeric"
                  className="w-28 rounded-lg px-3 py-2 text-sm outline-none bg-surface text-ink border border-border"
                />
                <button onClick={() => removeVariant(v.id)} className="text-muted">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addVariant} className="mt-2 text-xs flex items-center gap-1 text-accent">
            <Plus size={13} /> Add another size
          </button>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Delivery fee (optional)</label>
          <input
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            placeholder="Leave blank if none"
            inputMode="numeric"
            className="w-full mt-2 rounded-lg px-3 py-2.5 text-sm outline-none bg-surface text-ink border border-border"
          />
        </div>

        {error && <p className="text-xs text-alert">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl py-3.5 text-sm font-semibold text-onAccent disabled:opacity-60"
          style={{ background: SATIN_BTN, boxShadow: GLOSSY }}
        >
          {saving ? 'Saving…' : product ? 'Save changes' : 'Add to catalogue'}
        </button>
      </div>
    </div>
  );
}
