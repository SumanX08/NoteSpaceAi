import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  AtSign,
  Paperclip,
  Square,
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function ChatInput({
  onSend,
  streaming = false,
}) {
  const [input, setInput] = useState("");

  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input.trim());

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="shrink-0 px-6 pb-5 pt-2">
      <div className="mx-auto w-full max-w-3xl">

        <div className="relative rounded-2xl border border-border bg-card/60 shadow-soft transition-colors focus-within:border-primary/40 focus-within:shadow-glow">

          {/* Textarea */}

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            placeholder="Ask anything about your sources…"
            className="block max-h-40 w-full resize-none overflow-hidden bg-transparent px-4 pb-12 pt-3.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            onChange={(e) =>
              setInput(e.target.value)
            }
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

          {/* Toolbar */}

          <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 px-2.5 py-2">

            <ToolbarButton>
              <Paperclip className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton>
              <AtSign className="h-4 w-4" />
            </ToolbarButton>

            <span className="ml-2 text-[11px] text-muted-foreground">
              {input.length
                ? `${input.length} characters`
                : "Press Enter to send"}
            </span>

            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              onClick={handleSend}
              disabled={
                !input.trim() ||
                streaming
              }
              className={cn(
                "ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                input.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {streaming ? (
                <Square className="h-3.5 w-3.5 fill-current" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </motion.button>

          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Lumen can make mistakes. Verify important information against your sources.
        </p>

      </div>
    </div>
  );
}

function ToolbarButton({
  children,
}) {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}