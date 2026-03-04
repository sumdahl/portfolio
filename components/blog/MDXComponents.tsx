import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from './CodeBlock';

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-foreground mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-foreground mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-foreground mt-4 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-secondary/60 px-1.5 py-0.5 rounded-md text-[0.9rem] text-accent font-mono border border-border/60 shadow-sm">
            {children}
          </code>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-border border border-border rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-secondary/50">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border bg-card">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-secondary/30 transition-colors">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-muted-foreground">{children}</td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-4 italic text-accent my-4">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-8" />,
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  };
}
