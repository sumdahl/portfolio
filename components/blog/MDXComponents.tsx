import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-body mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-body mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-body mt-4 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-foreground/90 mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-foreground/90 mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="text-foreground/90">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-action hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-secondary/60 px-1.5 py-0.5 rounded-md text-[0.9rem] text-accent font-mono border border-border/60 shadow-sm">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-6 rounded-xl border border-border bg-[#1f2633] px-4 py-4 sm:px-5 sm:py-4 overflow-x-auto shadow-xl">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-4 italic text-accent my-4">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-8" />,
    strong: ({ children }) => <strong className="font-bold text-body">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  };
}
