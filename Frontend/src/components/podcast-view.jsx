import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Mic,
  GraduationCap,
  MessagesSquare,
  Repeat,
  Sparkles,
  Download,
  MoreHorizontal,
} from "lucide-react";

import { podcasts } from "@/lib/data";
import { cn } from "@/lib/utils";

const styleMeta = [
  {
    id: "teacher",
    label: "Teacher",
    icon: GraduationCap,
    desc: "Single narrator explains concepts",
  },
  {
    id: "conversation",
    label: "Conversation",
    icon: MessagesSquare,
    desc: "Two hosts discuss the topic",
  },
  {
    id: "interview",
    label: "Interview",
    icon: Mic,
    desc: "Q&A format with an expert guest",
  },
  {
    id: "revision",
    label: "Quick Revision",
    icon: Repeat,
    desc: "Fast recap of key points",
  },
];

const voiceMeta = [
  {
    id: "male",
    label: "Male",
  },
  {
    id: "female",
    label: "Female",
  },
  {
    id: "mixed",
    label: "Mixed",
  },
];

const durationMeta = [
  {
    id: "5",
    label: "5 min",
  },
  {
    id: "10",
    label: "10 min",
  },
  {
    id: "20",
    label: "20 min",
  },
];

export function PodcastView({
  podcasts: podcastList = podcasts,
}) {
  const [voice, setVoice] = useState("female");
  const [style, setStyle] = useState("teacher");
  const [duration, setDuration] = useState("10");
  const [playing, setPlaying] = useState(null);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-2xl px-6 py-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold tracking-tight">
            Podcast Studio
          </h2>

          <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
            Turn your notebook into an audio overview
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <FieldLabel>
            Podcast style
          </FieldLabel>

          <div className="grid grid-cols-2 gap-2">
            {styleMeta.map((item) => {
              const Icon = item.icon;
              const active =
                style === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setStyle(item.id)
                  }
                  className={cn(
                    "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20"
                      : "border-border bg-muted/20 hover:border-border-strong hover:bg-muted/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-[0.8125rem] font-medium",
                        active &&
                          "text-foreground"
                      )}
                    >
                      {item.label}
                    </p>

                    <p className="text-[0.6875rem] text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel>
                Voice
              </FieldLabel>

              <SegmentedGroup
                options={voiceMeta}
                value={voice}
                onChange={setVoice}
              />
            </div>

            <div>
              <FieldLabel>
                Duration
              </FieldLabel>

              <SegmentedGroup
                options={durationMeta}
                value={duration}
                onChange={setDuration}
              />
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.99,
            }}
            className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-glow transition-colors hover:bg-primary-hover"
          >
            <Sparkles className="h-4 w-4" />
            Generate Podcast
          </motion.button>
        </div>

        <div className="mt-7">
          <h3 className="mb-3 text-[0.8125rem] font-semibold text-muted-foreground">
            Recent podcasts
          </h3>

          <div className="space-y-2">
            {podcastList.map(
              (podcast, index) => (
                <motion.div
                  key={podcast.id}
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                >
                  <PodcastCard
                    podcast={podcast}
                    playing={
                      playing ===
                      podcast.id
                    }
                    onTogglePlay={() =>
                      setPlaying(
                        playing ===
                          podcast.id
                          ? null
                          : podcast.id
                      )
                    }
                  />
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
}) {
  return (
    <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground-dim">
      {children}
    </p>
  );
}

function SegmentedGroup({
  options,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-border bg-muted/30 p-0.5">
      {options.map((option) => {
        const active =
          value === option.id;

        return (
          <button
            key={option.id}
            onClick={() =>
              onChange(option.id)
            }
            className={cn(
              "relative flex h-8 flex-1 items-center justify-center rounded-lg text-[0.8125rem] font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${options
                  .map((o) => o.id)
                  .join("")}`}
                className="absolute inset-0 rounded-lg bg-background shadow-soft"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 32,
                }}
              />
            )}

            <span className="relative z-10">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const styleLabel = {
  teacher: "Teacher",
  conversation: "Conversation",
  interview: "Interview",
  revision: "Quick Revision",
};

function PodcastCard({
  podcast,
  playing,
  onTogglePlay,
}) {
  const [progress, setProgress] =
    useState(podcast.progress);

  const isReady =
    podcast.progress === 100;

  return (
        <div className="rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onTogglePlay}
          disabled={!isReady}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
            isReady
              ? "bg-primary text-primary-foreground shadow-glow hover:bg-primary-hover"
              : "cursor-not-allowed bg-muted text-muted-foreground-dim"
          )}
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            {playing ? (
              <motion.span
                initial={{
                  scale: 0.7,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.7,
                  opacity: 0,
                }}
              >
                <Pause className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                initial={{
                  scale: 0.7,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.7,
                  opacity: 0,
                }}
              >
                <Play className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[0.875rem] font-medium">
            {podcast.title}
          </h4>

          <div className="mt-0.5 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
              {styleLabel[podcast.style]}
            </span>

            <span className="text-muted-foreground-dim">
              ·
            </span>

            <span>
              {podcast.duration}
            </span>

            <span className="text-muted-foreground-dim">
              ·
            </span>

            <span>
              {podcast.createdAt}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground-dim transition-colors hover:bg-muted hover:text-foreground">
            <Download className="h-3.5 w-3.5" />
          </button>

          <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground-dim transition-colors hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {playing && isReady && (
        <motion.div
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={{
            height: "auto",
            opacity: 1,
          }}
          className="mt-3.5 overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground">
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) =>
                setProgress(
                  Number(e.target.value)
                )
              }
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            />

            <button className="text-muted-foreground hover:text-foreground">
              <SkipForward className="h-3.5 w-3.5" />
            </button>

            <span className="w-20 text-right font-mono text-[0.6875rem] text-muted-foreground">
              {fmt(
                progress,
                podcast.duration
              )}{" "}
              / {podcast.duration}
            </span>
          </div>
        </motion.div>
      )}

      {!isReady &&
        podcast.progress > 0 && (
          <div className="mt-3 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary animate-soft-pulse"
                style={{
                  width: `${podcast.progress}%`,
                }}
              />
            </div>

            <span>
              Generating…{" "}
              {podcast.progress}%
            </span>
          </div>
        )}
    </div>
  );
}

function fmt(
  pct,
  duration
) {
  const mins =
    parseInt(duration);

  const done = Math.round(
    (pct / 100) * mins
  );

  return `${done}m`;
}