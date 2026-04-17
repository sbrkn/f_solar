'use client';

import Link from 'next/link';
import { FileText, FolderOpen, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/useAuth';
import { Header } from '@/components/common/header';

export function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Documents', value: '0', icon: FileText, href: '/documents' },
    { label: 'Projects', value: '0', icon: FolderOpen, href: '/projects' },
    { label: 'Recent', value: '0', icon: Clock, href: '/documents' },
    { label: 'Activity', value: '0', icon: TrendingUp, href: '/documents' },
  ];

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.displayName?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening in your workspace
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/documents">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Document
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent documents placeholder */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Recent Documents</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
            <p className="text-center text-sm text-muted-foreground">
              Create your first document to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
