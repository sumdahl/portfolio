import Link from 'next/link';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold font-mono text-foreground hover:text-primary transition-colors tracking-tight">
          &lt;sumiranDahal /&gt;
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
