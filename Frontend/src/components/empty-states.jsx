import { motion } from "framer-motion";
import {
  Library,
  Plus,
  Check,
  Sparkles,
} from "lucide-react";

import { sourceIcon } from "@/lib/source-meta";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

const ACCENT_STYLES = {
  blue: {
    icon: "text-blue-300",
    chip: "bg-blue-500/10",
  },
  violet: {
    icon: "text-violet-300",
    chip: "bg-violet-500/10",
  },
  emerald: {
    icon: "text-emerald-300",
    chip: "bg-emerald-500/10",
  },
  rose: {
    icon: "text-rose-300",
    chip: "bg-rose-500/10",
  },
  amber: {
    icon: "text-amber-300",
    chip: "bg-amber-500/10",
  },
  cyan: {
    icon: "text-cyan-300",
    chip: "bg-cyan-500/10",
  },
};

const EMPTY_SOURCE_TYPES = [
  {
    type: "pdf",
    label: "PDF",
  },
  {
    type: "youtube",
    label: "YouTube",
  },
  {
    type: "website",
    label: "Website",
  },
  {
    type: "text",
    label: "Plain Text",
  },
  {
    type: "transcript",
    label: "Transcript (.vtt)",
  },
];

const CAPABILITIES = [
  "Ask grounded questions",
  "Generate personalized learning roadmaps",
  "Create AI podcasts",
  "Explore an interactive knowledge graph",
  "Generate quizzes & flashcards",
];

const EASE = [0.16, 1, 0.3, 1];

export function EmptyNotebookState() {
  const { setActiveTab } = useAppStore();

  const handleAddSource = () => {
    setActiveTab("sources");
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: EASE,
      }}
      className="flex flex-col items-center px-6 pb-10 pt-6 text-center"
    >
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          ease: EASE,
          delay: 0.05,
        }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 -z-10 rounded-[1.75rem] bg-primary/20 blur-2xl" />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/25 to-primary/5 ring-1 ring-primary/25">
          <Library className="h-8 w-8 text-primary" />
        </div>
      </motion.div>

      <h2 className="text-xl font-semibold tracking-tight sm:text-[1.375rem]">
        Build your knowledge base
      </h2>

      <p className="mt-2 max-w-md text-[0.875rem] leading-relaxed text-muted-foreground">
        Add one or more sources to start asking grounded questions,
        generate learning roadmaps, create podcasts,
        and explore your knowledge graph.
      </p>

      <div className="mt-7 grid w-full max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {EMPTY_SOURCE_TYPES.map((source, index) => {
          const Icon = sourceIcon[source.type];

          return (
            <motion.button
              key={source.type}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.07 + 0.15,
                duration: 0.3,
                ease: EASE,
              }}
              whileHover={{
                y: -2,
              }}
              onClick={handleAddSource}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/40 px-3 py-3.5 transition-colors hover:border-primary/40 hover:bg-card"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                <Icon className="h-4 w-4" />
              </span>

              <span className="text-[0.75rem] font-medium text-foreground/90">
                {source.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.45,
          duration: 0.35,
          ease: EASE,
        }}
        className="mt-8 w-full max-w-md rounded-2xl border border-border bg-card/30 p-4 text-left"
      >
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground-dim">
          What you can do after indexing
        </p>

        <ul className="space-y-2">
          {CAPABILITIES.map((capability) => (
            <li
              key={capability}
              className="flex items-center gap-2.5 text-[0.8125rem] text-foreground/85"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check
                  className="h-2.5 w-2.5"
                  strokeWidth={3}
                />
              </span>

              {capability}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.button
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.55,
          duration: 0.3,
          ease: EASE,
        }}
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.98,
        }}
        onClick={handleAddSource}
        className="mt-7 flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-[0.875rem] font-medium text-primary-foreground shadow-glow transition-colors hover:bg-primary-hover"
      >
        <Plus className="h-4 w-4" />
        Add Source
      </motion.button>
    </motion.div>
  );
}

export function ConversationStarters({
  suggestions,
  onPick,
}) {
  return (
        <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: EASE,
      }}
      className="flex flex-col items-center px-6 pt-6 text-center"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/20">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>

      <h2 className="text-xl font-semibold tracking-tight">
        Start a conversation
      </h2>

      <p className="mt-1.5 max-w-md text-[0.875rem] leading-relaxed text-muted-foreground">
        Ask questions about your sources, generate summaries,
        or build a personalized learning experience.
      </p>

      <div className="mt-7 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          const accent =
            ACCENT_STYLES[suggestion.accent];

          return (
            <motion.button
              key={suggestion.title}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05 + 0.1,
                duration: 0.3,
                ease: EASE,
              }}
              whileHover={{
                y: -2,
              }}
              onClick={() =>
                onPick(suggestion.prompt)
              }
              className="group flex flex-col gap-2.5 rounded-xl border border-border bg-card/40 p-3.5 text-left transition-colors hover:border-border-strong hover:bg-card"
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  accent.chip,
                  accent.icon
                )}
              >
                <Icon className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[0.8125rem] font-medium leading-snug text-foreground/90">
                  {suggestion.title}
                </p>

                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}