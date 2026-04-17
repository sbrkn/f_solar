'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { User, Moon, Sun, Monitor, CloudIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/common/header';
import { useAuth } from '@/lib/hooks/useAuth';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and workspace preferences
          </p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {user?.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user?.displayName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Link href="/settings/profile" className="ml-auto">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how F-Solar looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {[
                  { value: 'light', icon: Sun, label: 'Light' },
                  { value: 'dark', icon: Moon, label: 'Dark' },
                  { value: 'system', icon: Monitor, label: 'System' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                        theme === option.value
                          ? 'border-primary bg-primary/10'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Google Drive */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudIcon className="h-5 w-5" />
                Google Drive Integration
              </CardTitle>
              <CardDescription>
                Sync your documents with Google Drive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Connect Google Drive</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup documents to your Drive
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/api/google-drive/auth')}
                >
                  Connect
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync">Auto-sync enabled</Label>
                <Switch id="auto-sync" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
