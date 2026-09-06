import {
  SkipBack,
  SkipForward,
} from "lucide-react";

export default function PodcastPlayer({
  currentTime,
  audioDuration,
  progress,
  onSeek,
  onSkipBack,
  onSkipForward,
}) {
  return (
    <div className="mt-3.5 overflow-hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={onSkipBack}
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
          value={progress}
          onChange={(event) =>
            onSeek(event.target.value)
          }
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />

        <button
          onClick={onSkipForward}
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
    </div>
  );
}

function formatSeconds(seconds) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const total =
    Math.floor(seconds);

  const mins =
    Math.floor(total / 60);

  const secs =
    total % 60;

  return `${mins}:${String(
    secs
  ).padStart(2, "0")}`;
}