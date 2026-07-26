import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Sparkles,ArrowUp,Paperclip,AtSign,Copy,RefreshCw,ThumbsUp,ThumbsDown,Check,} from "lucide-react";

import { Markdown } from "./markdown";
import {
  EmptyNotebookState,
  ConversationStarters,
} from "./empty-states";

import { buildSuggestions } from "@/lib/suggestions";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { askQuestion } from "../services/chat";


export function ChatView({
  messages,
  onSend,
  streaming,
  notebookName,
  sources = [],
}) {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    setHoveredCitation,
    setActiveTab,
  } = useAppStore();

  const hasIndexedSources = sources.length > 0;

  const suggestions = useMemo(
    () =>
      buildSuggestions({
        notebookName,
      }),
    [notebookName]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = () => {
  if (!input.trim()) return;

  onSend(input);

  setInput("");
};
  const handleCopy = (msg) => {
    navigator.clipboard.writeText(msg.content);

    setCopiedId(msg.id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-8">
          {isEmpty ? (
            hasIndexedSources ? (
              <div className="flex flex-1 items-center justify-center">
                <ConversationStarters
                  suggestions={suggestions}
                  onPick={onSend}
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <EmptyNotebookState
                  onAddSource={() =>
                    setActiveTab("sources")
                  }
                />
              </div>
            )
          ) : (
            <div className="space-y-7">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <MessageBubble
                      message={msg}
                      copied={copiedId === msg.id}
                      onCopy={() => handleCopy(msg)}
                      onCitationHover={setHoveredCitation}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 px-6 pb-5 pt-2">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative rounded-2xl border border-border bg-card/60 shadow-soft transition-colors focus-within:border-primary/40 focus-within:shadow-glow">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              placeholder="Ask anything about your sources…"
              className="block max-h-40 w-full resize-none overflow-hidden bg-transparent px-4 pb-12 pt-3.5 text-[0.9375rem] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 px-2.5 py-2">
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Paperclip className="h-3.5 w-3.5" />
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <AtSign className="h-3.5 w-3.5" />
              </button>

              <span className="ml-1 text-[0.6875rem] text-muted-foreground-dim">
                {input.length
                  ? `${input.length} chars`
                  : "Press Enter to send"}
              </span>

              <motion.button
                whileTap={{
                  scale: 0.94,
                }}
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                className={cn(
                  "ml-auto flex h-7 w-7 items-center justify-center rounded-md transition-all",
                  input.trim() && !streaming
                    ? "bg-primary text-primary-foreground shadow-glow hover:bg-primary-hover"
                    : "bg-muted text-muted-foreground-dim"
                )}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </div>

          <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground-dim">
            Lumen can make mistakes. Verify important information against sources.
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onCitationHover,
  onCopy,
  copied,
}) {
  const isUser = message.role === "user";
console.log(message)
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md border border-primary/20 bg-primary/12 px-4 py-3 text-[0.9375rem] leading-relaxed text-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
        <div className="flex gap-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[0.8125rem] font-semibold">
            Lumen
          </span>

          <span className="text-[0.6875rem] text-muted-foreground-dim">
            {message.createdAt}
          </span>
        </div>
        

        <div className="rounded-2xl rounded-tl-md border border-border bg-card/40 px-4 py-3.5">
          <Markdown
            content={message.content}
            citations={message.citations}
            onCitationHover={onCitationHover}
          />

          {message.streaming && (
            <span className="streaming-caret" />
          )}
        </div>

        <div className="mt-2 flex items-center gap-0.5">
          <ActionButton
            onClick={onCopy}
            label={copied ? "Copied" : "Copy"}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </ActionButton>

          <ActionButton label="Regenerate">
            <RefreshCw className="h-3.5 w-3.5" />
          </ActionButton>

          <ActionButton label="Good response">
            <ThumbsUp className="h-3.5 w-3.5" />
          </ActionButton>

          <ActionButton label="Bad response">
            <ThumbsDown className="h-3.5 w-3.5" />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  label,
}) {
  return (
    <motion.button
      whileTap={{
        scale: 0.94,
      }}
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground-dim transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </motion.button>
  );
}