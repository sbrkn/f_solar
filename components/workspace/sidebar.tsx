'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, FolderOpen, LayoutDashboard, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <span className="font-bold text-sidebar-foreground">F Solar</span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      {/* Footer */}
      <div className="p-2 space-y-1">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
            pathname.startsWith('/settings') && 'bg-sidebar-accent text-sidebar-foreground'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        {!collapsed && user && (
          <>
            <Separator className="bg-sidebar-border my-1" />
            <div className="flex items-center gap-2 rounded-md px-3 py-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.photoURL ?? undefined} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-sidebar-foreground">
                  {user.displayName ?? user.email}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
