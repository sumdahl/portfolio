'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Home, LogOut, User, LayoutDashboard, PenTool, MessageSquare, ChevronRight, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardSidebar({ user, mobile }: DashboardSidebarProps & { mobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/posts', label: 'Posts', icon: PenTool },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-xl border-r border-border/50 shadow-2xl shadow-black/5">
      <SidebarHeader />

      <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
        <div className="space-y-6">
          <div className="space-y-1">
            <Typography.Small className="px-6 text-xs text-muted-foreground/50 uppercase tracking-widest font-bold mb-3 block">
              Platform
            </Typography.Small>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>

          {/* Example: Another Section */}
          <div className="space-y-1">
            <Typography.Small className="px-6 text-xs text-muted-foreground/50 uppercase tracking-widest font-bold mb-3 block">
              Manage
            </Typography.Small>
            <nav className="space-y-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2.5 mx-3 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 group"
              >
                <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <UserMenu user={user} onLogout={handleLogout} />
    </div>
  );

  if (mobile) {
    return (
      <div className="w-full bg-card/50 backdrop-blur-md border-b border-border/50 mb-6 rounded-lg overflow-hidden sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 bg-muted/10">
          <div className="flex gap-1 items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mr-3 shadow-md">
              <span className="text-sm font-bold text-white">B</span>
            </div>
            <span className="font-bold text-foreground">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-primary/20 hover:border-primary/50 transition-colors shadow-sm">
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <Typography.Small>{user.name || 'Admin'}</Typography.Small>
                    <Typography.Muted className="text-xs">{user.email}</Typography.Muted>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-72 border-r border-border/50 h-full flex flex-col bg-card/20 hidden md:flex sticky top-0">
      {sidebarContent}
    </aside>
  );
}

const getInitials = (name?: string | null, email?: string | null) => {
  if (name) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return email?.charAt(0).toUpperCase() || 'U';
};

const SidebarHeader = () => (
  <div className="p-6 border-b border-border/50">
    <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
        <span className="text-xl font-bold text-white">B</span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-foreground/90">Blog Admin</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Workspace</span>
      </div>
    </Link>
  </div>
);

const NavItem = ({ item, pathname }: { item: { href: string; label: string; icon: React.ElementType }; pathname: string | null }) => {
  const Icon = item.icon;
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 mx-3 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden",
        isActive
          ? "bg-primary/10 text-primary font-semibold shadow-sm"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
      <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="flex-1">{item.label}</span>
      {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
    </Link>
  );
};

const UserMenu = ({ user, onLogout }: { user: { name?: string | null; email?: string | null }; onLogout: () => void }) => (
  <div className="p-4 border-t border-border/50 bg-muted/5">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 p-2 h-auto hover:bg-muted/50 rounded-xl group transition-all"
        >
          <Avatar className="h-9 w-9 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-xs font-bold">
              {getInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left min-w-0">
            <Typography.Small className="block text-foreground group-hover:text-primary transition-colors truncate">
              {user.name || 'Admin User'}
            </Typography.Small>
            <Typography.Muted className="text-xs truncate opacity-70">
              {user.email}
            </Typography.Muted>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
        <DropdownMenuLabel>
          <Typography.Small>My Account</Typography.Small>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-500 focus:text-red-500 focus:bg-red-50/10 cursor-pointer gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
