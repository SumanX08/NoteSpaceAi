import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";
import MarkdownTable from "./MarkdownTable";
import CitationPill from "./CitationPill";

export default function Markdown({
  content,
  citations = [],
  onCitationHover,
  onCitationClick,
}) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => children,

          code(props) {
            return <CodeBlock {...props} />;
          },

          table(props) {
            return (
              <MarkdownTable {...props} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {citations.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">
            Sources:
          </span>

          {citations.map((citation) => (
            <CitationPill
              key={
                `${citation.sourceId}-${citation.chunkIndex}`
              }
              citation={citation}
              onHover={onCitationHover}
              onClick={onCitationClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}