'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareOptionsProps {
    title: string;
    slug: string;
}

export function ShareOptions({ title, slug }: ShareOptionsProps) {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const shareLinks = [
        {
            icon: Twitter,
            label: 'Twitter',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: 'hover:text-sky-500'
        },
        {
            icon: Linkedin,
            label: 'LinkedIn',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            color: 'hover:text-blue-600'
        },
        {
            icon: Facebook,
            label: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'hover:text-blue-500'
        }
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
            {shareLinks.map((link) => (
                <Button
                    key={link.label}
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full ${link.color}`}
                    onClick={() => window.open(link.href, '_blank', 'width=600,height=400')}
                    title={`Share on ${link.label}`}
                >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.label}</span>
                </Button>
            ))}
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:text-primary"
                onClick={handleCopy}
                title="Copy Link"
            >
                <Link2 className="h-4 w-4" />
                <span className="sr-only">Copy Link</span>
            </Button>
        </div>
    );
}
