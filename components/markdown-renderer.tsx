'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Code2 } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl border border-brand-200 dark:border-brand-800/80 overflow-hidden bg-brand-950 text-brand-100 shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-2 bg-brand-900/90 border-b border-brand-800/60 text-[11px] text-brand-300">
        <div className="flex items-center gap-1.5 font-mono">
          <Code2 className="w-3.5 h-3.5 text-brand-400" />
          <span>{language || 'code'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-brand-300 hover:text-brand-100 hover:bg-brand-800/60 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 sm:p-4 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed text-brand-100">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Strip any accidental emojis from response content to satisfy user requirement
  const cleanContent = content.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ''
  );

  return (
    <div className="w-full text-foreground space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-brand-950 dark:text-brand-50 mt-4 mb-2 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold font-heading text-brand-900 dark:text-brand-100 mt-3 mb-2 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-brand-900 dark:text-brand-100 mt-3 mb-1.5 tracking-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm sm:text-base font-semibold text-brand-800 dark:text-brand-200 mt-2 mb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-sm leading-relaxed text-brand-900/90 dark:text-brand-100/90 my-1.5">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-brand-950 dark:text-brand-50">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-brand-800 dark:text-brand-200">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 my-2 space-y-1 text-xs sm:text-sm text-brand-900/90 dark:text-brand-100/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 my-2 space-y-1 text-xs sm:text-sm text-brand-900/90 dark:text-brand-100/90">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-500/80 dark:border-brand-400/80 pl-3.5 py-1.5 my-2.5 bg-brand-100/40 dark:bg-brand-900/40 rounded-r text-xs sm:text-sm text-brand-800 dark:text-brand-200">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3.5 w-full rounded-xl border border-brand-200 dark:border-brand-800 shadow-xs">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-brand-100/70 dark:bg-brand-900/90 text-brand-900 dark:text-brand-100 font-semibold border-b border-brand-200 dark:border-brand-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-brand-100 dark:divide-brand-800/60">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="p-2.5 font-semibold text-brand-900 dark:text-brand-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 text-brand-800 dark:text-brand-200">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-4 border-brand-200 dark:border-brand-800" />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
            >
              {children}
            </a>
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-mono text-xs font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
