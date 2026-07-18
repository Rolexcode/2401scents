'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { signIn } from '@/lib/auth';

const GLOSSY = '0 1px 2px rgba(43,36,25,0.10), inset 0 1px 0 rgba(255,255,255,0.35)';
const SATIN_BTN = 'linear-gradient(120deg, #6B3F2A 0%, #C9853F 50%, #6B3F2A 100%)';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError('Wrong email or password. Try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="satin-hero flex flex-col items-center justify-center px-6" style={{ paddingTop: 56, paddingBottom: 44 }}>
        <div className="satin-sheen" />
        <Lock size={22} className="relative mb-3" style={{ color: '#FBF3E4' }} />
        <h2
          className="font-display text-2xl mb-1 relative"
          style={{ color: '#FBF3E4', fontWeight: 700, textShadow: '0 2px 14px rgba(0,0,0,0.35)' }}
        >
          Admin access
        </h2>
        <p className="text-xs relative" style={{ color: 'rgba(251,243,228,0.85)' }}>
          Sign in to manage the catalogue.
        </p>
      </div>

      <div className="flex flex-col items-center px-6 pt-8">
        <form onSubmit={submit} className="w-full max-w-xs">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-surface text-ink border border-border"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full mt-3 rounded-lg px-4 py-3 text-sm outline-none bg-surface text-ink border border-border"
          />
          {error && <p className="text-xs mt-2 text-alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-lg py-3 text-sm font-semibold text-onAccent disabled:opacity-60"
            style={{ background: SATIN_BTN, boxShadow: GLOSSY }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
