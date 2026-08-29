import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAppStore } from "@/store/appStore";
import { buildSuggestions } from "@/lib/suggestions";

import MessageBubble from "./MessageBubble";
import EmptyNotebookState from "./empty/EmptyNotebookState";
import ConversationStarters from "./empty/ConversationStarters";

export default function ChatMessages({
  messages,
  notebookName,
  sources,
  onSend,
}) {
  const scrollRef = useRef(null);

  const setActiveTab = useAppStore(
    (state) => state.setActiveTab
  );

  const setHoveredCitation = useAppStore(
    (state) => state.setHoveredCitation
  );

  const hasIndexedSources = sources.length > 0;

  const suggestions = useMemo(
    () =>
      buildSuggestions({
        notebookName,
      }),
    [notebookName]
  );

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto scrollbar-thin"
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-8">

        {messages.length === 0 ? (
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
              {messages.map((message) => (
                <motion.div
                  key={message.id}
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
                  }}
                >
                  <MessageBubble
                    message={message}
                    sources={sources}
                    onCitationHover={
                      setHoveredCitation
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}