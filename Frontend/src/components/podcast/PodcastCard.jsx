import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Play,
  Pause,
  Download,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  styleLabel,
} from "./podcast.constants";

import PodcastPlayer from "./PodcastPlayer";

export default function PodcastCard({
  podcast,
  playing,
  progress,
  currentTime,
  audioDuration,
  onTogglePlay,
  onSeek,
  onSkipBack,
  onSkipForward,
  onDownload,
}) {
  const isReady =
    podcast.status === "ready" &&
    Boolean(podcast.audioUrl);

  const isGenerating =
    podcast.status ===
    "generating";

  const isFailed =
    podcast.status ===
    "failed";

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60">
      <div className="flex items-center gap-3.5">
        <button
          onClick={() =>
            onTogglePlay(
              podcast
            )
          }
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
                key="pause"
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
                key="play"
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
              {
                styleLabel[
                  podcast.style
                ]
              }
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
          <button
            onClick={() =>
              onDownload(
                podcast
              )
            }
            disabled={!isReady}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground-dim transition-colors hover:bg-muted hover:text-foreground",

              !isReady &&
                "cursor-not-allowed opacity-40"
            )}
          >
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
        >
          <PodcastPlayer
            progress={progress}
            currentTime={
              currentTime
            }
            audioDuration={
              audioDuration
            }
            onSeek={onSeek}
            onSkipBack={
              onSkipBack
            }
            onSkipForward={
              onSkipForward
            }
          />
        </motion.div>
      )}

      {isGenerating && (
        <div className="mt-3 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 rounded-full bg-primary animate-soft-pulse" />
          </div>

          <span>
            Generating…
          </span>
        </div>
      )}

      {isFailed && (
        <div className="mt-3 text-[0.6875rem] text-red-500">
          {podcast.error ||
            "Generation failed"}
        </div>
      )}
    </div>
  );
}