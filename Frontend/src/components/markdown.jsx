import { Fragment } from "react";
import { parseCitations, tokenize } from "@/lib/markdown";
import { CitationPill } from "./citation-pill";
import { useAppStore } from "@/store/appStore";

/**
 * Render inline markdown:
 * - bold
 * - inline code
 * - links
 * - citation pills
 */
function renderInline(text, citations, onHover) {
  const parts = parseCitations(text, citations);

  return parts.map((part, idx) => {
    if (part.cite) {
      return (
        <CitationPill
          key={`cite-${idx}`}
          label={part.text}
          sourceId={part.cite.sourceId}
          detail={part.cite.detail}
          onHover={onHover}
        />
      );
    }

    return (
      <Fragment key={`text-${idx}`}>
        {formatInline(part.text)}
      </Fragment>
    );
  });
}

/**
 * Format:
 * **bold**
 * `inline code`
 * [links](url)
 */
function formatInline(text) {
  const nodes = [];

  const regex =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(
        <Fragment key={key++}>
          {text.slice(last, match.index)}
        </Fragment>
      );
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++}>
          {token.slice(2, -2)}
        </strong>
      );
    }

    else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded-[5px] bg-muted px-1.5 py-0.5 font-mono text-[0.8em] text-foreground/90"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    else if (token.startsWith("[")) {
      const link =
        /\[([^\]]+)\]\(([^)]+)\)/.exec(token);

      if (link) {
        nodes.push(
          <a
            key={key++}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {link[1]}
          </a>
        );
      }
    }

    last = match.index + token.length;
  }

  if (last < text.length) {
    nodes.push(
      <Fragment key={key++}>
        {text.slice(last)}
      </Fragment>
    );
  }

  return nodes;
}

export function Markdown({
  content="",
  citations=[],
}) {
  const { setHoveredCitation } =
    useAppStore();

  const tokens = tokenize(content);

  return (
    <div className="prose-chat">
      {tokens.map((tok, i) => {
        switch (tok.type) {
          case "h1":
            return (
              <h1 key={i}>
                {renderInline(
                  tok.text,
                  citations,
                  setHoveredCitation
                )}
              </h1>
            );

          case "h2":
            return (
              <h2 key={i}>
                {renderInline(
                  tok.text,
                  citations,
                  setHoveredCitation
                )}
              </h2>
            );

          case "h3":
            return (
              <h3 key={i}>
                {renderInline(
                  tok.text,
                  citations,
                  setHoveredCitation
                )}
              </h3>
            );

          case "p":
            return (
              <p key={i}>
                {renderInline(
                  tok.text,
                  citations,
                  setHoveredCitation
                )}
              </p>
            );

          case "blockquote":
            return (
              <blockquote key={i}>
                {renderInline(
                  tok.text,
                  citations,
                  setHoveredCitation
                )}
              </blockquote>
            );

          case "code":
            return (
              <pre
                key={i}
                className="my-3 overflow-x-auto rounded-xl border border-border bg-background/60 p-4 text-[0.8125rem] leading-relaxed"
              >
                <code className="font-mono text-foreground/90">
                  {tok.text}
                </code>
              </pre>
            );

          case "table":
            return (
                              <div
                key={i}
                className="my-3 overflow-x-auto rounded-xl border border-border bg-background/40"
              >
                <table className="w-full text-left text-[0.8125rem]">
                  <thead>
                    <tr className="border-b border-border">
                      {tok.rows[0].map((cell, ci) => (
                        <th
                          key={ci}
                          className="px-3 py-2 font-medium text-muted-foreground"
                        >
                          {renderInline(
                            cell,
                            citations,
                            setHoveredCitation
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {tok.rows.slice(1).map((row, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-border/60 last:border-0"
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-3 py-2 text-foreground/90"
                          >
                            {renderInline(
                              cell,
                              citations,
                              setHoveredCitation
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "list":
            return tok.ordered ? (
              <ol key={i}>
                {tok.items.map((item, ii) => (
                  <li key={ii}>
                    {renderInline(
                      item,
                      citations,
                      setHoveredCitation
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {tok.items.map((item, ii) => (
                  <li key={ii}>
                    {renderInline(
                      item,
                      citations,
                      setHoveredCitation
                    )}
                  </li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}