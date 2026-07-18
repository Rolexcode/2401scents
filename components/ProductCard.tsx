'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ImageOff } from 'lucide-react';
import { formatNaira } from '@/lib/config';
import type { Product, Variant } from '@/types/product';

const GLOSSY = '0 1px 2px rgba(43,36,25,0.10), inset 0 1px 0 rgba(255,255,255,0.35)';
const SOFT_SHADOW = '0 1px 3px rgba(43,36,25,0.08)';
const SATIN_BTN = 'linear-gradient(120deg, #6B3F2A 0%, #C9853F 50%, #6B3F2A 100%)';

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product, variant: Variant) => void;
}) {
  const [variantIdx, setVariantIdx] = useState(0);
  const variant = product.variants[variantIdx];
  const priceLabel =
    product.variants.length > 1
      ? `${formatNaira(Math.min(...product.variants.map((v) => v.price)))} – ${formatNaira(Math.max(...product.variants.map((v) => v.price)))}`
      : formatNaira(product.variants[0]?.price);

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-surface" style={{ boxShadow: SOFT_SHADOW }}>
      <div className="relative aspect-square bg-surfaceAlt">
        <div className="flex items-center justify-center w-full h-full overflow-hidden">
          {product.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.photoUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ImageOff size={28} className="text-muted" />
          )}
        </div>
        {product.photoUrl && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 28% 22%, rgba(255,255,255,0.6), transparent 55%)' }}
          />
        )}
      </div>
      <div className="p-3">
        <p className="font-display font-semibold text-sm leading-tight text-ink">{product.name}</p>
        <p className="text-xs mt-1 font-medium text-accent">{priceLabel}</p>

        {product.variants.length > 1 && (
          <div className="relative mt-2">
            <select
              value={variantIdx}
              onChange={(e) => setVariantIdx(Number(e.target.value))}
              className="w-full appearance-none text-xs rounded-md pl-2 pr-6 py-1.5 bg-surfaceAlt text-ink border border-border"
            >
              {product.variants.map((v, i) => (
                <option key={v.id} value={i}>
                  {v.label} — {formatNaira(v.price)}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
          </div>
        )}

        <button
          onClick={() => onAdd(product, variant)}
          className="mt-2 w-full flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold text-onAccent"
          style={{ background: SATIN_BTN, boxShadow: GLOSSY }}
        >
          <Plus size={13} /> Add to cart
        </button>
      </div>
    </div>
  );
}
