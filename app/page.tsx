'use client';

import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, MessageCircle, X, Search } from 'lucide-react';
import { subscribeToProducts } from '@/lib/catalog';
import { STORE_NAME, STORE_TAGLINE, WHATSAPP_NUMBER, INSTAGRAM_URL, TIKTOK_URL, formatNaira, waLink } from '@/lib/config';
import ProductCard from '@/components/ProductCard';
import type { Product, Variant, CartItem } from '@/types/product';

const GLOSSY = '0 1px 2px rgba(43,36,25,0.10), inset 0 1px 0 rgba(255,255,255,0.35)';
const SOFT_SHADOW = '0 1px 3px rgba(43,36,25,0.08)';
const SATIN_BTN = 'linear-gradient(120deg, #6B3F2A 0%, #C9853F 50%, #6B3F2A 100%)';

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function StorefrontPage() {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [request, setRequest] = useState('');
  const [search, setSearch] = useState('');
  const requestSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeToProducts((products) => {
      setCatalog(products);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const inStock = catalog.filter((p) => p.inStock !== false);
  const filtered = inStock.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));
  const total = cart.reduce((s, i) => s + Number(i.price) + Number(i.deliveryFee || 0), 0);

  function addToCart(product: Product, variant: Variant) {
    setCart((c) => [...c, { cartId: newId(), name: product.name, variantLabel: variant.label, price: variant.price, deliveryFee: product.deliveryFee || 0 }]);
    setCartOpen(true);
  }
  function removeFromCart(cartId: string) {
    setCart((c) => c.filter((i) => i.cartId !== cartId));
  }

  function sendCartOrder() {
    if (cart.length === 0) return;
    let msg = `Hi ${STORE_NAME}! I'd like to order:\n\n`;
    cart.forEach((i) => {
      msg += `• ${i.name} (${i.variantLabel}) — ${formatNaira(i.price)}`;
      if (i.deliveryFee) msg += ` + delivery ${formatNaira(i.deliveryFee)}`;
      msg += '\n';
    });
    msg += `\nTotal: ${formatNaira(total)}`;
    window.open(waLink(WHATSAPP_NUMBER, msg), '_blank');
  }
  function sendRequest() {
    if (!request.trim()) return;
    window.open(waLink(WHATSAPP_NUMBER, `Hi ${STORE_NAME}! I'm looking for: ${request.trim()}`), '_blank');
    setRequest('');
  }
  function goAskAboutSearch() {
    setRequest(search);
    requestSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase text-accent">Loading catalogue…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: `linear-gradient(180deg, #F1ECE1, #E6DCC5)` }}>
      <header className="satin-hero px-6 pt-12 pb-10 text-center">
        <div className="satin-sheen" />
        <p className="text-xs uppercase mb-2 relative" style={{ color: '#F0D9B8', letterSpacing: '0.3em' }}>Fragrance Atelier</p>
        <h1 className="font-display text-4xl tracking-tight relative" style={{ fontWeight: 700, color: '#FBF3E4', textShadow: '0 2px 14px rgba(0,0,0,0.35)' }}>{STORE_NAME}</h1>
        <p className="font-display italic text-lg mt-2 relative" style={{ color: 'rgba(251,243,228,0.85)' }}>{STORE_TAGLINE}</p>
      </header>

      <main className="px-4 pt-6">
        <div className="relative mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fragrances…"
            className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none bg-surface text-ink border border-border"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>

        {inStock.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display italic text-lg text-ink">The shelf is empty right now.</p>
            <p className="text-sm mt-1 text-muted">New scents are added daily — check back soon.</p>
          </div>
        ) : search.trim() && filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted mb-3">No matches for &quot;{search}&quot;.</p>
            <button onClick={goAskAboutSearch} className="text-sm font-semibold underline underline-offset-2 text-accent">
              Ask us on WhatsApp instead
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        )}
      </main>

      <section ref={requestSectionRef} className="px-4 mt-10">
        <div className="rounded-2xl p-5 bg-surface border border-border" style={{ boxShadow: SOFT_SHADOW }}>
          <p className="font-display italic text-lg mb-1 text-ink">Can&apos;t find what you want?</p>
          <p className="text-xs mb-3 text-muted">Tell us the scent or brand you&apos;re after and we&apos;ll reply on WhatsApp.</p>
          <textarea value={request} onChange={(e) => setRequest(e.target.value)} placeholder="e.g. Bleu de Chanel, 100ml…" rows={2}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none bg-surfaceAlt text-ink border border-border" />
          <button onClick={sendRequest} className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-onAccent"
            style={{ background: SATIN_BTN, boxShadow: GLOSSY }}>
            <MessageCircle size={16} /> Ask on WhatsApp
          </button>
        </div>
      </section>

      <footer className="text-center mt-14 pb-4">
        <div className="flex items-center justify-center gap-3 text-xs text-muted">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Instagram</a>
          <span>·</span>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">TikTok</a>
        </div>
      </footer>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-4">
          {cartOpen && (
            <div className="rounded-2xl p-4 mb-2 max-h-64 overflow-y-auto bg-surface border" style={{ borderColor: '#82652F', boxShadow: SOFT_SHADOW }}>
              {cart.map((i) => (
                <div key={i.cartId} className="flex items-center justify-between py-1.5 text-sm" style={{ borderBottom: '1px dashed #DFD2B4' }}>
                  <div>
                    <p className="text-ink">{i.name} <span className="text-muted">({i.variantLabel})</span></p>
                    <p className="text-xs text-accent">{formatNaira(i.price)}{i.deliveryFee ? ` + ${formatNaira(i.deliveryFee)} delivery` : ''}</p>
                  </div>
                  <button onClick={() => removeFromCart(i.cartId)} className="text-alert">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setCartOpen((o) => !o)} className="w-full flex items-center justify-between rounded-2xl px-5 py-3.5 text-onAccent"
            style={{ background: SATIN_BTN, boxShadow: GLOSSY }}>
            <span className="flex items-center gap-2 text-sm font-semibold"><ShoppingBag size={18} /> {cart.length} item{cart.length > 1 ? 's' : ''}</span>
            <span className="text-sm font-semibold">{formatNaira(total)}</span>
          </button>
          {cartOpen && (
            <button onClick={sendCartOrder} className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold bg-surface text-accent"
              style={{ border: '1.5px solid #82652F' }}>
              <MessageCircle size={16} /> Order on WhatsApp
            </button>
          )}
        </div>
      )}
    </div>
  );
}