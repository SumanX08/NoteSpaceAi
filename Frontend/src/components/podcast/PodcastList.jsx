import {
  motion,
} from "framer-motion";

import PodcastCard from "./PodcastCard";

export default function PodcastList({
  podcasts,
  loading,
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
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card/40 p-4 text-center text-[0.75rem] text-muted-foreground">
        Loading podcasts…
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No podcasts yet
        </p>

        <p className="mt-1 text-[0.6875rem] text-muted-foreground-dim">
          Generate your first podcast
          from this notebook.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {podcasts.map(
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
              progress={
                playing ===
                podcast.id
                  ? progress
                  : 0
              }
              currentTime={
                playing ===
                podcast.id
                  ? currentTime
                  : 0
              }
              audioDuration={
                playing ===
                podcast.id
                  ? audioDuration
                  : 0
              }
              onTogglePlay={
                onTogglePlay
              }
              onSeek={onSeek}
              onSkipBack={
                onSkipBack
              }
              onSkipForward={
                onSkipForward
              }
              onDownload={
                onDownload
              }
            />
          </motion.div>
        )
      )}
    </div>
  );
}