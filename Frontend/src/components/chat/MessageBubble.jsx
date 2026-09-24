import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot,
} from "lucide-react";

import Markdown from "./markdown/Markdown";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import CitationPill from "./markdown/CitationPill";

export default function MessageBubble({
  message,
  sources = [],
  onCitationHover,
  onCitationClick,
}) {
  const isUser = message.role === "user";

  const [copied, setCopied] = useState(false);

  const {
    setPanelMode,
    setPreviewSource,
  } = useAppStore();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      message.content
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            max-w-[80%]
            rounded-2xl
            rounded-br-md
            bg-[#1D315B]
            px-4
            py-3
            text-sm
            text-primary-foreground
            shadow-soft
          "
        >
          {message.content}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="group"
    >
      <div className="flex gap-3">
        {/* AI Avatar */}
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-primary/10
            ring-1
            ring-primary/20
          "
        >
          <Bot className="h-4 w-4 text-primary" />
        </div>
<div className="flex flex-col">
  <div className="min-w-0 flex-1 
    rounded-2xl
    rounded-tl-md
    border
    border-[#1F2937]
    bg-[#111827]
    px-5
    py-4  ">
         <Markdown
  content={message.content}
  citations={message.citations ?? []}
  showCitations={false}
  onCitationHover={onCitationHover}
  onCitationClick={(citation) => {
    onCitationClick(
      citation,
      message.citations
    );
  }}
/>

{message.citations?.length > 0 && (
  <div className="mt-2 flex flex-wrap gap-1.5">
    {message.citations.map((citation) => (
      <CitationPill
        key={`${citation.sourceId}-${citation.index}`}
        citation={citation}
        onClick={() =>
          onCitationClick(
            citation,
            message.citations
          )
        }
      />
    ))}
  </div>
)}

          {/* Actions */}
          
        </div>
        <div
            className="
              mt-3
              flex
              items-center
              gap-1
              opacity-0
              transition-opacity
              group-hover:opacity-100
            "
          >
            <IconButton onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </IconButton>

            <IconButton>
              <ThumbsUp className="h-4 w-4" />
            </IconButton>

            <IconButton>
              <ThumbsDown className="h-4 w-4" />
            </IconButton>

            <IconButton>
              <RefreshCw className="h-4 w-4" />
            </IconButton>
          </div>
</div>
        {/* Message */}
        
      </div>
    </motion.div>
  );
}

function IconButton({
  children,
  className,
  ...props
}) {
  return (
    <button
      {...props}
      className={cn(
        `
          rounded-md
          p-1.5
          text-muted-foreground
          transition-colors
          hover:bg-muted
          hover:text-foreground
        `,
        className
      )}
    >
      {children}
    </button>
  );
}