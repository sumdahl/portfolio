'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Home, User, FolderGit2, FileText, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: User },
  { name: 'Projects', href: '/projects', icon: FolderGit2 },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'text-sm font-semibold uppercase tracking-wide transition-colors relative group',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile Menu (ShadCN Sheet) */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground -mr-2">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] border-l border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background/95 backdrop-blur-xl shadow-2xl shadow-black/30 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="px-4 pt-6 pb-3">
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary via-accent to-primary/60 opacity-80" />
            </div>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3 rounded-2xl border border-transparent transition-all duration-200 group',
                      isActive
                        ? 'bg-primary/15 text-primary font-semibold shadow-lg shadow-black/10 ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                    )}
                  >
                    <span className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60",
                      isActive ? "border-primary/30 bg-primary/15" : "group-hover:border-border/90"
                    )}>
                      <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    </span>
                    <span className="text-lg tracking-tight">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 px-4">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border/80 to-transparent" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
