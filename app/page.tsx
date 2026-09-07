'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { subscribeToProducts } from '@/lib/catalog';
import {
  STORE_NAME,
  STORE_TAGLINE,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  TIKTOK_URL,
  formatNaira,
  waLink,
} from '@/lib/config';
import ProductCard from '@/components/ProductCard';
import type { Product, Variant, CartItem } from '@/types/product';

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
  const shopSectionRef = useRef<HTMLElement>(null);
  const requestSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const unsub = subscribeToProducts((products) => {
      setCatalog(products);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const inStock = catalog.filter((p) => p.inStock !== false);
  const filtered = inStock.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const heroProduct = inStock.find((p) => p.photoUrl) ?? inStock[0];
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) + Number(item.deliveryFee || 0),
    0,
  );

  function addToCart(product: Product, variant: Variant) {
    setCart((current) => [
      ...current,
      {
        cartId: newId(),
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        deliveryFee: product.deliveryFee || 0,
      },
    ]);
    setCartOpen(true);
  }

  function removeFromCart(cartId: string) {
    setCart((current) => current.filter((item) => item.cartId !== cartId));
  }

  function sendCartOrder() {
    if (cart.length === 0) return;

    let msg = `Hi ${STORE_NAME}! I'd like to order:\n\n`;
    cart.forEach((item) => {
      msg += `• ${item.name} (${item.variantLabel}) — ${formatNaira(item.price)}`;
      if (item.deliveryFee) {
        msg += ` + delivery ${formatNaira(item.deliveryFee)}`;
      }
      msg += '\n';
    });
    msg += `\nTotal: ${formatNaira(total)}`;
    window.open(waLink(WHATSAPP_NUMBER, msg), '_blank');
  }

  function sendRequest() {
    if (!request.trim()) return;
    window.open(
      waLink(
        WHATSAPP_NUMBER,
        `Hi ${STORE_NAME}! I'm looking for: ${request.trim()}`,
      ),
      '_blank',
    );
    setRequest('');
  }

  function goAskAboutSearch() {
    setRequest(search);
    requestSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] text-[#181512]">
        <div className="text-center">
          <p className="font-display text-3xl font-semibold tracking-[-0.03em]">{STORE_NAME}</p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#756E66]">Loading perfumes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] pb-28 text-[#181512]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F7F4EE]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between py-4 sm:py-5">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl"
              aria-label="Back to top"
            >
              {STORE_NAME}
            </button>

            <p className="hidden text-[10px] uppercase tracking-[0.28em] text-[#756E66] md:block">
              Fragrance, personally selected
            </p>

            <div className="flex items-center gap-5 text-xs font-medium">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden underline-offset-4 hover:underline sm:inline"
              >
                Instagram
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden underline-offset-4 hover:underline sm:inline"
              >
                TikTok
              </a>
              <button
                onClick={() => cart.length > 0 && setCartOpen(true)}
                className="flex items-center gap-1.5"
                aria-label="Open cart"
              >
                <ShoppingBag size={17} strokeWidth={1.6} />
                <span>Cart ({cart.length})</span>
              </button>
            </div>
          </div>

          <label className="relative block border-t border-black/10">
            <span className="sr-only">Search perfumes</span>
            <Search
              size={17}
              strokeWidth={1.6}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#756E66]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search perfumes..."
              className="w-full bg-transparent py-3.5 pl-7 pr-9 text-sm outline-none placeholder:text-[#948D84] sm:py-4"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#756E66]"
                aria-label="Clear search"
              >
                <X size={16} strokeWidth={1.6} />
              </button>
            )}
          </label>
        </div>
      </header>

      <main>
        {!search.trim() && (
          <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-12 md:items-center lg:px-12 lg:py-20">
            <div className="md:col-span-6 lg:col-span-5">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6D2234]">
                2401 Scents
              </p>
              <h1 className="max-w-2xl font-display text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.055em]">
                Wear something memorable.
              </h1>
              <p className="mt-7 max-w-md text-sm leading-7 text-[#5D5750] sm:text-base">
                {STORE_TAGLINE}. Discover perfumes for everyday wear, special nights and the moods in between.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <button
                  onClick={() => shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex items-center gap-3 border-b border-[#181512] pb-1 text-xs font-semibold uppercase tracking-[0.16em]"
                >
                  Shop perfumes
                  <ArrowDown size={15} className="transition-transform group-hover:translate-y-1" />
                </button>
                <button
                  onClick={() => requestSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6D2234]"
                >
                  Request a perfume
                </button>
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
              {heroProduct?.photoUrl ? (
                <figure className="ml-auto max-w-[620px]">
                  <div className="aspect-[4/5] overflow-hidden bg-[#E9E3DA]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroProduct.photoUrl}
                      alt={heroProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-start justify-between gap-4 border-t border-black/15 pt-3">
                    <div>
                      <p className="font-display text-lg font-semibold leading-none">{heroProduct.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#756E66]">Featured perfume</p>
                    </div>
                    {heroProduct.variants[0] && (
                      <p className="text-xs font-semibold">{formatNaira(heroProduct.variants[0].price)}</p>
                    )}
                  </figcaption>
                </figure>
              ) : (
                <div className="flex aspect-[4/5] max-w-[620px] items-end bg-[#251A1D] p-8 text-[#F7F4EE] sm:p-12">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">2401 Scents</p>
                    <p className="mt-3 max-w-md font-display text-5xl font-medium leading-[0.95] tracking-[-0.04em]">
                      Your next perfume starts here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section
          ref={shopSectionRef}
          className={`scroll-mt-28 border-t border-black/10 ${search.trim() ? 'border-t-0' : ''}`}
        >
          <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D2234]">
                {search.trim() ? 'Search results' : 'Shop'}
              </p>
              <h2 className="mt-2 font-display text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                {search.trim() ? `Results for “${search}”` : 'Available perfumes'}
              </h2>
              <p className="mt-2 text-xs text-[#756E66]">
                {search.trim()
                  ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}`
                  : `${inStock.length} perfume${inStock.length === 1 ? '' : 's'} available`}
              </p>
            </div>

            {inStock.length === 0 ? (
              <div className="border-y border-black/10 py-20 text-center">
                <p className="font-display text-3xl font-medium">No perfumes available right now.</p>
                <p className="mt-2 text-sm text-[#756E66]">New perfumes are added regularly — check back soon.</p>
              </div>
            ) : search.trim() && filtered.length === 0 ? (
              <div className="border-y border-black/10 py-16 text-center">
                <p className="text-sm text-[#756E66]">We couldn&apos;t find &quot;{search}&quot;.</p>
                <button
                  onClick={goAskAboutSearch}
                  className="mt-4 border-b border-[#181512] pb-1 text-xs font-semibold uppercase tracking-[0.14em]"
                >
                  Ask us on WhatsApp
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          ref={requestSectionRef}
          className="scroll-mt-28 bg-[#331921] text-[#F7F4EE]"
        >
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-end lg:px-12 lg:py-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9AEB6]">Can&apos;t find it?</p>
              <h2 className="mt-3 max-w-xl font-display text-5xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                Tell us the perfume you want.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                Send the perfume name, brand or size and we&apos;ll reply on WhatsApp.
              </p>
            </div>

            <div>
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="e.g. Bleu de Chanel, 100ml"
                rows={3}
                className="w-full resize-none border-b border-white/40 bg-transparent py-3 text-lg outline-none placeholder:text-white/35 focus:border-white"
              />
              <button
                onClick={sendRequest}
                className="mt-5 inline-flex items-center gap-2 bg-[#F7F4EE] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#251A1D] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle size={16} strokeWidth={1.7} />
                Ask on WhatsApp
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-9 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
          <div>
            <p className="font-display text-3xl font-semibold tracking-[-0.04em]">{STORE_NAME}</p>
            <p className="mt-1 text-xs text-[#756E66]">{STORE_TAGLINE}</p>
          </div>
          <div className="flex gap-6 text-xs font-medium">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">Instagram</a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">TikTok</a>
          </div>
        </div>
      </footer>

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5 sm:pb-5">
          <div className="mx-auto max-w-xl">
            {cartOpen && (
              <div className="mb-2 max-h-72 overflow-y-auto border border-black/15 bg-[#F7F4EE] p-4 shadow-[0_18px_50px_rgba(20,15,12,0.16)]">
                <div className="mb-3 flex items-center justify-between border-b border-black/10 pb-3">
                  <p className="font-display text-xl font-semibold">Your cart</p>
                  <button onClick={() => setCartOpen(false)} aria-label="Close cart">
                    <X size={18} strokeWidth={1.6} />
                  </button>
                </div>
                {cart.map((item) => (
                  <div key={item.cartId} className="flex items-start justify-between gap-4 border-b border-black/10 py-3 last:border-0">
                    <div>
                      <p className="font-display text-base font-semibold leading-tight">{item.name}</p>
                      <p className="mt-1 text-[11px] text-[#756E66]">{item.variantLabel}</p>
                      <p className="mt-1 text-xs font-semibold">
                        {formatNaira(item.price)}
                        {item.deliveryFee ? ` + ${formatNaira(item.deliveryFee)} delivery` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-[#8C3448]"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={16} strokeWidth={1.6} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={sendCartOrder}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-[#331921] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F4EE]"
                >
                  <MessageCircle size={16} strokeWidth={1.7} /> Order on WhatsApp
                </button>
              </div>
            )}

            <button
              onClick={() => setCartOpen((open) => !open)}
              className="flex w-full items-center justify-between bg-[#181512] px-5 py-3.5 text-[#F7F4EE] shadow-[0_12px_35px_rgba(20,15,12,0.18)]"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                <ShoppingBag size={17} strokeWidth={1.6} />
                Cart ({cart.length})
              </span>
              <span className="text-sm font-semibold">{formatNaira(total)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
