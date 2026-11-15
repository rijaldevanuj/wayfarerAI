'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please add both an email and a password to continue.');
      return;
    }

    const supabase = createClient();
    setLoading(true);
    setError('');

    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }

      router.push('/planner');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1F2A] px-4 py-10 text-[#F5EFE6]">
      <div className="w-full max-w-md rounded-[28px] border border-[#1E3A4A] bg-[#0E222D] p-6 shadow-2xl shadow-black/30">
        <div className="mb-7 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[#FF7A45]">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#FF7A45]/70 text-lg">✦</span>
            <span>Wayfarer</span>
          </div>
          <span>Journeys</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-[#F5EFE6]">Welcome back.</h1>

        <div className="mt-6 grid grid-cols-2 rounded-full border border-[#203D4B] bg-[#102937] p-1 text-[11px] font-medium uppercase tracking-[0.22em]">
          <button
            type="button"
            onClick={() => setMode('sign-in')}
            className={`rounded-full px-4 py-3 transition ${
              mode === 'sign-in' ? 'bg-[#FF7A45] text-[#0B1F2A]' : 'text-[#9FB1BC]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('sign-up')}
            className={`rounded-full px-4 py-3 transition ${
              mode === 'sign-up' ? 'bg-[#FF7A45] text-[#0B1F2A]' : 'text-[#9FB1BC]'
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2 text-[11px] uppercase tracking-[0.24em] text-[#9FB1BC]">
            <span>Email address</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-[#203D4B] bg-[#102937] px-4 py-3 text-sm text-[#F5EFE6] placeholder:text-[#9FB1BC] outline-none transition focus:border-[#FF7A45]"
            />
          </label>

          <label className="block space-y-2 text-[11px] uppercase tracking-[0.24em] text-[#9FB1BC]">
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-[#203D4B] bg-[#102937] px-4 py-3 text-sm text-[#F5EFE6] placeholder:text-[#9FB1BC] outline-none transition focus:border-[#FF7A45]"
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-[#FF7A45]/60 bg-[#FF7A45]/10 px-3 py-2 text-sm text-[#FFD7C2]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[#FF7A45] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0B1F2A] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign in' : 'Create account'} ↗
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/planner" className="text-sm text-[#9FB1BC] underline decoration-[#FF7A45] underline-offset-4">
            Continue as guest
          </Link>
        </div>
      </div>
    </main>
  );
}
