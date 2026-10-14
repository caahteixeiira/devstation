import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="min-w-0 space-y-6 leading-7 text-foreground-muted">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => (
            <h2 className="mt-10 text-3xl font-semibold text-foreground">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 text-2xl font-semibold text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-xl font-semibold text-foreground">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6">{children}</ol>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary-strong underline underline-offset-4"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-strong pl-4 italic">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-xl border border-border bg-surface-muted p-4 text-sm">
              {children}
            </pre>
          ),
          code: ({ className, children }) => (
            <code className={`font-mono text-sm ${className ?? ""}`}>
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-surface-muted p-3 font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border p-3">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
