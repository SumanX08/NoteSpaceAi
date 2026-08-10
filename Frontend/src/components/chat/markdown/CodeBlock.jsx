import { useState } from "react";
import {
  Copy,
  Check,
} from "lucide-react";

export default function CodeBlock({
  className,
  children,
}) {
  const [copied, setCopied] =
    useState(false);

  const language =
    className?.replace("language-", "") ??
    "text";

  const code = String(children).replace(
    /\n$/,
    ""
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(
      code
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border bg-card">

      <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2">

        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="rounded-md p-1 hover:bg-background"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>

      </div>

      <pre className="overflow-x-auto p-4 text-sm">
        <code>{code}</code>
      </pre>

    </div>
  );
}