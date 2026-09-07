'use client';

import { useState } from 'react';
import { ChevronDown, ImageOff, Plus } from 'lucide-react';
import { formatNaira } from '@/lib/config';
import type { Product, Variant } from '@/types/product';

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
    <article className="group">
      <div className="aspect-[4/5] overflow-hidden bg-[#EAE4DC]">
        {product.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.photoUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#8B837A]">
            <ImageOff size={26} strokeWidth={1.4} />
          </div>
        )}
      </div>

      <div className="border-t border-black/10 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-[1.05] tracking-[-0.02em] sm:text-xl">
              {product.name}
            </h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6D2234]">
              {priceLabel}
            </p>
          </div>
        </div>

        {product.variants.length > 1 && (
          <div className="relative mt-3">
            <select
              value={variantIdx}
              onChange={(e) => setVariantIdx(Number(e.target.value))}
              className="w-full appearance-none border-b border-black/20 bg-transparent py-2 pr-6 text-xs outline-none focus:border-black"
            >
              {product.variants.map((v, i) => (
                <option key={v.id} value={i}>
                  {v.label} — {formatNaira(v.price)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#756E66]"
            />
          </div>
        )}

        <button
          onClick={() => onAdd(product, variant)}
          className="mt-3 inline-flex items-center gap-2 border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
        >
          <Plus size={13} strokeWidth={1.6} /> Add to cart
        </button>
      </div>
    </article>
  );
}
