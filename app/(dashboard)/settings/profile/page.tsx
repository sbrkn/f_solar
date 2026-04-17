'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { updateUserProfile } from '@/lib/firebase/auth';
import { toast } from 'sonner';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(displayName);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Update your personal information</p>
      </div>
      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="name">
            Display Name
          </label>
          <input
            id="name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={user?.email ?? ''}
            disabled
            className="w-full rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
