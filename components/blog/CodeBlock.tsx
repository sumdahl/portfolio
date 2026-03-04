"use client";

import { useState, useRef, ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const getCodeText = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (!node) return '';
    
    if (Array.isArray(node)) {
      return node.map(getCodeText).join('');
    }
    
    if (typeof node === 'object' && node !== null && 'props' in node) {
      const element = node as { props?: { children?: ReactNode } };
      return getCodeText(element.props?.children);
    }
    
    return '';
  };

  const handleCopy = async () => {
    const text = getCodeText(children);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#2d333b] border border-gray-600 text-xs text-gray-400 hover:text-white hover:bg-[#3c444d] transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
      <pre className="rounded-xl border border-border bg-[#0d1117] px-4 py-4 sm:px-5 sm:py-4 overflow-x-auto shadow-xl">
        {children}
      </pre>
    </div>
  );
}
