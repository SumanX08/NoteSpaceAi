import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";
import MarkdownTable from "./MarkdownTable";
import CitationPill from "./CitationPill";

export default function Markdown({
  content,
  citations = [],
  onCitationClick,
  showCitations = true,
}) {
 const cleanedContent = content.replace(
  /(^|\n)\s*\.\s*(?=\n|$)/g,
  "$1"
);

const parts = cleanedContent.split(
  /(\[\d+\])/g
);
 return (
  <div className="prose-chat max-w-none">
    {parts.map((part, index) => {
      const match = part.match(/^\[(\d+)\]$/);

      if (match) {
        const citationIndex = Number(match[1]);

        if (!showCitations) {
          return null;
        }

        const citation = citations.find(
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

        return null;
      }

      // Remove standalone dot
      if (part.trim() === ".") {
        return null;
      }

      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ children }) => children,

            code(props) {
              return <CodeBlock {...props} />;
            },

            table(props) {
              return <MarkdownTable {...props} />;
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