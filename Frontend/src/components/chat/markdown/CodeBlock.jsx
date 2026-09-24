import { useState } from "react";
import {
  Copy,
  Check,
} from "lucide-react";

export default function CodeBlock({
  className,
  children,
}) {
  const [copied, setCopied] = useState(false);

  const language =
    className?.replace("language-", "") ?? "text";

  const code = String(children).replace(
    /\n$/,
    ""
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </span>

        <button
          onClick={handleCopy}
          title="Copy code"
          className="
            rounded-md
            p-1
            text-muted-foreground
            transition-colors
            hover:bg-background
            hover:text-foreground
          "
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="scrollbar-thin overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}