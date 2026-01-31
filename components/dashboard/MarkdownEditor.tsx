'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false }
);

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    return (
        <div data-color-mode="dark">
            <MDEditor
                value={value}
                onChange={onChange}
                height={400}
                preview="edit"
                className="rounded-md overflow-hidden border border-border"
                style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)', // Ensure text matches project theme
                    '--color-canvas-default': 'var(--background)', // Editor background
                    '--color-canvas-subtle': 'var(--secondary)', // Toolbar background etc
                    '--color-border-default': 'var(--border)',
                    '--color-fg-default': 'var(--foreground)', // Text color
                    '--color-fg-muted': 'var(--muted-foreground)',
                    '--color-accent-fg': 'var(--primary)', // Link color
                } as React.CSSProperties}
            />
        </div>
    );
}
