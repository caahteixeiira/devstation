import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUpRightIcon } from "@/components/ui/icons";

type MarkdownContentProps = {
  content: string;
};

const linkStyles =
  "rounded-sm text-primary-strong underline decoration-primary/50 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong motion-reduce:transition-none";

/**
 * Links do Markdown por tipo de destino:
 * - "/..."            → Link do Next (navegação interna)
 * - "#..."            → âncora comum
 * - http(s)://...     → nova aba com rel seguro
 * - mailto:, tel:     → âncora comum, sem nova aba
 * - demais            → âncora comum (react-markdown já descarta protocolos inseguros)
 */
function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (!href) {
    return <span>{children}</span>;
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkStyles}>
        {children}
      </Link>
    );
  }

  if (/^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkStyles} inline-flex items-center gap-0.5`}
      >
        {children}
        <ArrowUpRightIcon className="size-3.5 shrink-0" />
      </a>
    );
  }

  return (
    <a href={href} className={linkStyles}>
      {children}
    </a>
  );
}

/** Nome da linguagem a partir da classe `language-x` que o Markdown já gera no <code>. */
function codeLanguage(children: ReactNode): string | null {
  const [first] = Children.toArray(children);

  if (!isValidElement<{ className?: string }>(first)) {
    return null;
  }

  return first.props.className?.match(/language-([\w+#-]+)/)?.[1] ?? null;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="min-w-0 space-y-5 leading-8 text-foreground-muted [&_img]:my-2 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-card [&_img]:border [&_img]:border-border [&_img]:bg-surface-muted">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          // h1 do Markdown vira h2: o h1 da página é o título do artigo.
          h1: ({ children }) => (
            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-9 text-xl font-semibold tracking-tight text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-7 text-lg font-semibold text-foreground">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mt-6 font-semibold text-foreground">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-foreground">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-[1.0625rem] leading-8">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6 marker:text-primary-strong">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6 marker:font-mono marker:text-primary-strong">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[1.0625rem] leading-8 [&>ol]:mt-2 [&>ul]:mt-2">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <MarkdownLink href={href}>{children}</MarkdownLink>
          ),
          blockquote: ({ children }) => (
            <blockquote className="rounded-r-control border-l-2 border-primary-strong bg-surface-muted px-5 py-3 [&>p]:text-base [&>p]:leading-7">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-border" />,
          pre: ({ children }) => {
            const language = codeLanguage(children);

            return (
              <div className="overflow-hidden rounded-card border border-border bg-surface-muted">
                {language && (
                  <div className="flex items-center justify-between border-b border-border px-4 py-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                      {language}
                    </span>
                  </div>
                )}

                <pre className="overflow-x-auto p-4 text-sm leading-6 text-foreground [&>code]:rounded-none [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-sm">
                  {children}
                </pre>
              </div>
            );
          },
          code: ({ className, children }) => (
            <code
              className={`rounded-sm border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground ${className ?? ""}`}
            >
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-card border border-border">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-muted">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="whitespace-nowrap border-b border-border px-3 py-2 font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-3 py-2 align-top leading-6">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
