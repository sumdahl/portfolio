import { SocialLinks } from '../shared/SocialLinks';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} Sumiran Dahal. All rights reserved.
          </p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
