import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Circle,
  CircleDot,
  Clock,
  ChevronDown,
  Play,
  Link2,
  Sparkles,
} from "lucide-react";

import { roadmap } from "@/lib/data";
import {
  sourceIcon,
  sourceTypeLabel,
} from "@/lib/source-meta";
import { cn } from "@/lib/utils";

const difficultyStyle = {
  Beginner: "text-success bg-success/10",
  Intermediate: "text-warning bg-warning/10",
  Advanced: "text-destructive bg-destructive/10",
};

const topicIcon = {
  done: Check,
  "in-progress": CircleDot,
  todo: Circle,
};

const topicColor = {
  done: "bg-success text-success-foreground border-success/40",
  "in-progress":
    "bg-primary text-primary-foreground border-primary",
  todo: "bg-muted text-muted-foreground border-border",
};

export function LearnView({
  sources = [],
}) {
  const [expanded, setExpanded] =
    useState("r2t3");

  const sourcesById = useMemo(
    () =>
      Object.fromEntries(
        sources.map((s) => [s.id, s])
      ),
    [sources]
  );

  const totalTopics = roadmap.reduce(
    (acc, section) =>
      acc + section.topics.length,
    0
  );

  const doneTopics = roadmap.reduce(
    (acc, section) =>
      acc +
      section.topics.filter(
        (topic) => topic.status === "done"
      ).length,
    0
  );

  const progress = Math.round(
    (doneTopics / totalTopics) * 100
  );

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-2xl px-6 py-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold tracking-tight">
            Learning Roadmap
          </h2>

          <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
            A structured path built from your
            sources
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>

            <span className="text-[0.75rem] font-medium text-muted-foreground">
              {doneTopics}/{totalTopics} ·{" "}
              {progress}%
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute bottom-2 left-3.75 top-2 w-px bg-border" />

          <div className="space-y-6">
            {roadmap.map(
              (section, sectionIndex) => {
                const SectionIcon =
                  topicIcon[section.status];

                return (
                  <motion.div
                    key={section.id}
                    initial={{
                      opacity: 0,
                      x: -8,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        sectionIndex * 0.08,
                      duration: 0.3,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                          topicColor[
                            section.status
                          ]
                        )}
                      >
                        <SectionIcon className="h-4 w-4" />
                      </div>

                      <div className="flex items-baseline gap-2">
                        <h3 className="text-[0.9375rem] font-semibold">
                          {section.title}
                        </h3>

                        <span className="text-[0.6875rem] text-muted-foreground-dim">
                          {
                            section.topics.filter(
                              (topic) =>
                                topic.status ===
                                "done"
                            ).length
                          }
                          /
                          {
                            section.topics.length
                          }
                        </span>
                      </div>
                    </div>

                    <div className="ml-11 mt-2 space-y-1.5">
                      {section.topics.map(
                        (topic) => (
                          <TopicItem
                            key={topic.id}
                            topic={topic}
                            sourcesById={
                              sourcesById
                            }
                            expanded={
                              expanded ===
                              topic.id
                            }
                            onToggle={() =>
                              setExpanded(
                                expanded ===
                                  topic.id
                                  ? null
                                  : topic.id
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
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
            delay: 0.3,
          }}
          className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>

          <div className="flex-1">
            <p className="text-[0.8125rem] font-medium">
              Recommended next
            </p>

            <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
              Continue with{" "}
              <span className="text-foreground">
                useEffect & Side Effects
              </span>{" "}
              — it builds directly on the
              state hooks you just
              completed.
            </p>

            <button className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[0.75rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
              <Play className="h-3 w-3" />
              Start learning
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TopicItem({
  topic,
  expanded,
  onToggle,
  sourcesById,
}) {
  const TopicIcon =
    topicIcon[topic.status];

  return (
        <div
      className={cn(
        "rounded-xl border transition-colors",
        expanded
          ? "border-border-strong bg-card/60"
          : "border-border bg-card/20"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            topicColor[topic.status]
          )}
        >
          <TopicIcon className="h-3 w-3" />
        </div>

        <span
          className={cn(
            "flex-1 text-[0.8125rem] font-medium",
            topic.status === "done" &&
              "text-muted-foreground line-through decoration-muted-foreground/40"
          )}
        >
          {topic.title}
        </span>

        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[0.625rem] font-medium",
            difficultyStyle[topic.difficulty]
          )}
        >
          {topic.difficulty}
        </span>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground-dim transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-3 pb-3.5 pl-11">
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {topic.description}
              </p>

              <div className="flex items-center gap-3 text-[0.6875rem] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {topic.time}
                </span>
              </div>

              <div>
                <p className="mb-1.5 flex items-center gap-1 text-[0.6875rem] font-medium text-muted-foreground">
                  <Link2 className="h-3 w-3" />
                  Related sources
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {topic.sources.map((sourceId) => {
                    const source =
                      sourcesById[sourceId];

                    if (!source) return null;

                    const Icon =
                      sourceIcon[source.type];

                    return (
                      <span
                        key={source.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2 py-1 text-[0.6875rem] text-muted-foreground"
                      >
                        <Icon className="h-3 w-3" />
                        {source.title}
                      </span>
                    );
                  })}
                </div>
              </div>

              <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[0.75rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
                <Play className="h-3 w-3" />
                Start Learning
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}