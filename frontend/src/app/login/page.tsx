'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthValidator } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (AuthValidator.validateCredentials(username, password)) {
      AuthValidator.setAuthToken('demo_session_token_123');
      router.push('/dashboard');
    } else {
      setLoading(false);
      setErrorMsg('Invalid demo credentials. Use Username: 123 and Password: 123');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col justify-between p-6 font-sans transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold text-xs">
            R
          </div>
          <span className="font-bold text-sm tracking-tight">ResearchMind</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Centered Minimalist Auth Card */}
      <div className="w-full max-w-sm mx-auto space-y-6 my-auto">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Sign in to ResearchMind
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Access your academic paper library, RAG chat assistant, and synthesis matrices.
          </p>
        </div>

        {/* Demo Credentials Tip Box */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div>
            <span className="font-semibold block text-[11px] uppercase tracking-wider">Demo Credentials</span>
            <span className="font-mono text-[11px]">Username: <strong>123</strong> | Password: <strong>123</strong></span>
          </div>
          <button
            onClick={() => { setUsername('123'); setPassword('123'); }}
            className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-mono px-2 py-1 rounded hover:opacity-80 transition-opacity"
          >
            Auto-fill
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleLogin} className="ui-card p-6 bg-white dark:bg-zinc-900 space-y-4 shadow-sm">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Username</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-zinc-400 absolute left-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="123"
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123"
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-zinc-400 font-mono">
        ResearchMind Academic Workspace &copy; 2026–2027 Capstone
      </div>
    </div>
  );
}
