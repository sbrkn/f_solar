'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase/auth';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Failed to send reset email. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
      <h2 className="mb-2 text-xl font-bold">Reset your password</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send a reset link.
      </p>
      {sent ? (
        <p className="text-sm text-green-600">
          Check your inbox for a password reset link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/login" className="underline hover:text-foreground">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
