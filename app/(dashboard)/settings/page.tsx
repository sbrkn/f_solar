import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      <div className="grid gap-4 max-w-xl">
        <Link
          href="/settings/profile"
          className="flex items-center justify-between rounded-xl border bg-card p-4 hover:bg-accent transition-colors"
        >
          <div>
            <p className="font-medium">Profile</p>
            <p className="text-sm text-muted-foreground">Update your name and photo</p>
          </div>
          <span className="text-muted-foreground">›</span>
        </Link>
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <div>
            <p className="font-medium">Google Drive</p>
            <p className="text-sm text-muted-foreground">Connect your Google Drive for backups</p>
          </div>
          <Link
            href="/api/google-drive/auth"
            className="text-sm font-medium text-primary hover:underline"
          >
            Connect
          </Link>
        </div>
      </div>
    </div>
  );
}
