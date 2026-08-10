import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot,
  User,
} from "lucide-react";

import Markdown from "./markdown/Markdown";
import { cn } from "@/lib/utils";

export default function MessageBubble({
  message,
  onCitationHover,
}) {
  const isUser = message.role === "user";

  const [copied, setCopied] = useState(false);

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
          className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground shadow-soft"
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
        {/* Avatar */}

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>

        {/* Message */}

        <div className="min-w-0 flex-1">
          <Markdown
            content={message.content}
            citations={
              message.citations ?? []
            }
            onCitationHover={
              onCitationHover
            }
          />

          {/* Actions */}

          <div className="mt-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">

            <IconButton
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
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
        "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}