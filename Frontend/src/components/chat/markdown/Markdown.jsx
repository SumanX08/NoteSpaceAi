import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";
import MarkdownTable from "./MarkdownTable";
import CitationPill from "./CitationPill";

export default function Markdown({
  content,
  citations = [],
  onCitationClick,
}) {
  const parts = content.split(/(\[\d+\])/g);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-pre:p-0">
      {parts.map((part, index) => {
        const match = part.match(/^\[(\d+)\]$/);

        if (match) {
          const citationIndex =
            Number(match[1]);

          const citation =
            citations.find(
              (item) =>
                item.index === citationIndex
            );

          if (citation) {
            return (
              <CitationPill
                key={index}
                citation={citation}
                onClick={onCitationClick}
              />
            );
          }
        }

        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ children }) =>
                children,

              code(props) {
                return (
                  <CodeBlock {...props} />
                );
              },

              table(props) {
                return (
                  <MarkdownTable
                    {...props}
                  />
                );
              },
            }}
          >
            {part}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}