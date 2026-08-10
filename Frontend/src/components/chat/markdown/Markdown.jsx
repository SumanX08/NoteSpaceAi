import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";
import MarkdownTable from "./MarkdownTable";
import CitationPill from "./CitationPill";

export default function Markdown({
  content,
  citations = [],
  onCitationHover,
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
    </div>
  );
}