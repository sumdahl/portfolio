import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/sumdahl',
    icon: <Github className="w-5 h-5" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sumiran-dahal-108285220/',
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/sumiran_dahal',
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    name: 'Email',
    url: 'mailto:sumirandahal46@gmail.com',
    icon: <Mail className="w-5 h-5" />,
  },
];

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link) => (
        <Link
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-action transition-colors"
          aria-label={link.name}
        >
          {link.icon}
        </Link>
      ))}
    </div>
  );
}
