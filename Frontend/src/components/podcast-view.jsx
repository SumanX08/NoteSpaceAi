import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

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

import {
  generatePodcast,
  getPodcasts,
} from "@/services/podcast.service";

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
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "mixed", label: "Mixed" },
];

const durationMeta = [
  { id: "5", label: "5 min" },
  { id: "10", label: "10 min" },
  { id: "20", label: "20 min" },
];

export function PodcastView({ notebook }) {
  const [voice, setVoice] = useState("female");
  const [style, setStyle] = useState("teacher");
  const [duration, setDuration] = useState("10");

  const [podcastList, setPodcastList] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [playing, setPlaying] =
    useState(null);

  const [progress, setProgress] =
    useState(0);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [audioDuration, setAudioDuration] =
    useState(0);

  const audioRef =
    useRef(null);

  // ====================================================
  // LOAD PODCASTS
  // ====================================================

  useEffect(() => {
    if (!notebook?.id) return;

    loadPodcasts();
  }, [notebook?.id]);

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      setError("");

      const res =
        await getPodcasts(notebook.id);

      const podcasts =
        res.data ?? [];

      setPodcastList(
        podcasts.map(normalizePodcast)
      );
    } catch (error) {
      console.error(
        "Failed to load podcasts:",
        error
      );

      setError(
        error?.message ||
          "Failed to load podcasts."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GENERATE
  // ====================================================

  const handleGenerate = async () => {
    if (!notebook?.id) {
      setError(
        "No active notebook selected."
      );
      return;
    }

    if (generating) return;

    try {
      setGenerating(true);
      setError("");

      const res =
        await generatePodcast(
          notebook.id,
          {
            style,
            voice,
            duration,
          }
        );

      const generatedPodcast =
        res.data;

      if (!generatedPodcast) {
        throw new Error(
          "Podcast generation returned no data."
        );
      }

      const normalized =
        normalizePodcast(
          generatedPodcast
        );

      setPodcastList(
        (current) => [
          normalized,
          ...current,
        ]
      );
    } catch (error) {
      console.error(
        "Failed to generate podcast:",
        error
      );

      setError(
        error?.message ||
          "Failed to generate podcast."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ====================================================
  // PLAY / PAUSE
  // ====================================================

  const handleTogglePlay = async (
    podcast
  ) => {
    const audio =
      audioRef.current;

    if (!audio || !podcast.audioUrl) {
      return;
    }

    try {
      // Pause currently playing podcast
      if (
        playing === podcast.id
      ) {
        audio.pause();
        setPlaying(null);
        return;
      }

      // Stop previous audio
      audio.pause();

      // Load new podcast
      audio.src =
        podcast.audioUrl;

      audio.load();

      setCurrentTime(0);
      setProgress(0);
      setAudioDuration(0);

      // Play
      await audio.play();

      setPlaying(
        podcast.id
      );
    } catch (error) {
      console.error(
        "Audio playback failed:",
        error
      );

      setError(
        "Unable to play this podcast."
      );
    }
  };

  // ====================================================
  // AUDIO TIME UPDATE
  // ====================================================

  const handleTimeUpdate = () => {
    const audio =
      audioRef.current;

    if (!audio) return;

    const current =
      audio.currentTime || 0;

    const total =
      audio.duration || 0;

    setCurrentTime(current);

    if (total > 0) {
      setProgress(
        (current / total) * 100
      );
    }
  };

  // ====================================================
  // AUDIO METADATA
  // ====================================================

  const handleLoadedMetadata = () => {
    const audio =
      audioRef.current;

    if (!audio) return;

    if (
      Number.isFinite(
        audio.duration
      )
    ) {
      setAudioDuration(
        audio.duration
      );
    }
  };

  // ====================================================
  // AUDIO ENDED
  // ====================================================

  const handleAudioEnded = () => {
    setPlaying(null);
    setProgress(0);
    setCurrentTime(0);
  };

  // ====================================================
  // SEEK
  // ====================================================

  const handleSeek = (
    value
  ) => {
    const audio =
      audioRef.current;

    if (!audio) return;

    const percentage =
      Number(value);

    if (
      !Number.isFinite(
        audio.duration
      )
    ) {
      return;
    }

    const newTime =
      (percentage / 100) *
      audio.duration;

    audio.currentTime =
      newTime;

    setProgress(
      percentage
    );

    setCurrentTime(
      newTime
    );
  };

  // ====================================================
  // SKIP
  // ====================================================

  const skip = (seconds) => {
    const audio =
      audioRef.current;

    if (!audio) return;

    audio.currentTime =
      Math.max(
        0,
        Math.min(
          audio.duration || 0,
          audio.currentTime +
            seconds
        )
      );
  };

  // ====================================================
  // DOWNLOAD
  // ====================================================

  const handleDownload = (
    podcast
  ) => {
    if (!podcast.audioUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href =
      podcast.audioUrl;

    link.target =
      "_blank";

    link.rel =
      "noopener noreferrer";

    link.download =
      `${podcast.title}.mp3`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <audio
        ref={audioRef}
        onTimeUpdate={
          handleTimeUpdate
        }
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onEnded={
          handleAudioEnded
        }
      />

      <div className="mx-auto max-w-2xl px-6 py-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold tracking-tight">
            Podcast Studio
          </h2>

          <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
            Turn your notebook into an audio overview
          </p>
        </div>

        {/* GENERATOR */}

        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <FieldLabel>
            Podcast style
          </FieldLabel>

          <div className="grid grid-cols-2 gap-2">
            {styleMeta.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  style ===
                  item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setStyle(
                        item.id
                      )
                    }
                    disabled={
                      generating
                    }
                    className={cn(
                      "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                      active
                        ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20"
                        : "border-border bg-muted/20 hover:border-border-strong hover:bg-muted/40",
                      generating &&
                        "cursor-not-allowed opacity-60"
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
              }
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel>
                Voice
              </FieldLabel>

              <SegmentedGroup
                options={
                  voiceMeta
                }
                value={voice}
                onChange={
                  setVoice
                }
                disabled={
                  generating
                }
              />
            </div>

            <div>
              <FieldLabel>
                Duration
              </FieldLabel>

              <SegmentedGroup
                options={
                  durationMeta
                }
                value={
                  duration
                }
                onChange={
                  setDuration
                }
                disabled={
                  generating
                }
              />
            </div>
          </div>

          <motion.button
            whileHover={{
              scale:
                generating
                  ? 1
                  : 1.01,
            }}
            whileTap={{
              scale:
                generating
                  ? 1
                  : 0.99,
            }}
            onClick={
              handleGenerate
            }
            disabled={
              generating
            }
            className={cn(
              "mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-glow transition-colors hover:bg-primary-hover",
              generating &&
                "cursor-not-allowed opacity-70"
            )}
          >
            <Sparkles
              className={cn(
                "h-4 w-4",
                generating &&
                  "animate-spin"
              )}
            />

            {generating
              ? "Generating Podcast…"
              : "Generate Podcast"}
          </motion.button>

          {error && (
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[0.75rem] text-red-500">
              {error}
            </div>
          )}
        </div>

        {/* RECENT PODCASTS */}

        <div className="mt-7">
          <h3 className="mb-3 text-[0.8125rem] font-semibold text-muted-foreground">
            Recent podcasts
          </h3>

          {loading ? (
            <div className="rounded-2xl border border-border bg-card/40 p-4 text-center text-[0.75rem] text-muted-foreground">
              Loading podcasts…
            </div>
          ) : podcastList.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No podcasts yet
              </p>

              <p className="mt-1 text-[0.6875rem] text-muted-foreground-dim">
                Generate your first podcast from this notebook.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {podcastList.map(
                (
                  podcast,
                  index
                ) => (
                  <motion.div
                    key={
                      podcast.id
                    }
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
                        index *
                        0.05,
                    }}
                  >
                    <PodcastCard
                      podcast={
                        podcast
                      }
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
                      onTogglePlay={() =>
                        handleTogglePlay(
                          podcast
                        )
                      }
                      onSeek={
                        handleSeek
                      }
                      onSkipBack={() =>
                        skip(-10)
                      }
                      onSkipForward={() =>
                        skip(10)
                      }
                      onDownload={() =>
                        handleDownload(
                          podcast
                        )
                      }
                    />
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FIELD LABEL
// ======================================================

function FieldLabel({
  children,
}) {
  return (
    <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground-dim">
      {children}
    </p>
  );
}

// ======================================================
// SEGMENTED GROUP
// ======================================================

function SegmentedGroup({
  options,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-border bg-muted/30 p-0.5">
      {options.map(
        (option) => {
          const active =
            value ===
            option.id;

          return (
            <button
              key={option.id}
              onClick={() =>
                onChange(
                  option.id
                )
              }
              disabled={
                disabled
              }
              className={cn(
                "relative flex h-8 flex-1 items-center justify-center rounded-lg text-[0.8125rem] font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                disabled &&
                  "cursor-not-allowed opacity-60"
              )}
            >
              {active && (
                <motion.span
                  layoutId={`seg-${options
                    .map(
                      (o) =>
                        o.id
                    )
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
                {
                  option.label
                }
              </span>
            </button>
          );
        }
      )}
    </div>
  );
}

// ======================================================
// PODCAST CARD
// ======================================================

const styleLabel = {
  teacher:
    "Teacher",

  conversation:
    "Conversation",

  interview:
    "Interview",

  revision:
    "Quick Revision",
};

function PodcastCard({
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
    podcast.status ===
      "ready" &&
    Boolean(
      podcast.audioUrl
    );

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60">
      <div className="flex items-center gap-3.5">
        <button
          onClick={
            onTogglePlay
          }
          disabled={
            !isReady
          }
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
              {
                podcast.duration
              }
            </span>

            <span className="text-muted-foreground-dim">
              ·
            </span>

            <span>
              {
                podcast.createdAt
              }
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={
              onDownload
            }
            disabled={
              !isReady
            }
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

      {/* PLAYER */}

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
            <button
              onClick={
                onSkipBack
              }
              className="text-muted-foreground hover:text-foreground"
              title="Back 10 seconds"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={
                progress
              }
              onChange={(e) =>
                onSeek(
                  e.target.value
                )
              }
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            />

            <button
              onClick={
                onSkipForward
              }
              className="text-muted-foreground hover:text-foreground"
              title="Forward 10 seconds"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>

            <span className="w-24 text-right font-mono text-[0.6875rem] text-muted-foreground">
              {formatSeconds(
                currentTime
              )}{" "}
              /{" "}
              {formatSeconds(
                audioDuration
              )}
            </span>
          </div>
        </motion.div>
      )}

      {/* GENERATING */}

      {!isReady &&
        podcast.status ===
          "generating" && (
          <div className="mt-3 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 rounded-full bg-primary animate-soft-pulse" />
            </div>

            <span>
              Generating…
            </span>
          </div>
        )}

      {/* FAILED */}

      {!isReady &&
        podcast.status ===
          "failed" && (
          <div className="mt-3 text-[0.6875rem] text-red-500">
            Generation failed
          </div>
        )}
    </div>
  );
}

// ======================================================
// NORMALIZE
// ======================================================

function normalizePodcast(
  podcast
) {
  return {
    ...podcast,

    id:
      podcast.id ||
      podcast._id,

    duration:
      `${podcast.duration} min`,

    progress:
      podcast.status ===
      "ready"
        ? 100
        : 0,

    createdAt:
      formatDate(
        podcast.createdAt
      ),
  };
}

// ======================================================
// DATE
// ======================================================

function formatDate(
  date
) {
  if (!date) {
    return "Just now";
  }

  const value =
    new Date(date);

  if (
    Number.isNaN(
      value.getTime()
    )
  ) {
    return "Just now";
  }

  return value.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

// ======================================================
// TIME
// ======================================================

function formatSeconds(
  seconds
) {
  if (
    !Number.isFinite(
      seconds
    ) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const total =
    Math.floor(seconds);

  const mins =
    Math.floor(
      total / 60
    );

  const secs =
    total % 60;

  return `${mins}:${String(
    secs
  ).padStart(2, "0")}`;
}