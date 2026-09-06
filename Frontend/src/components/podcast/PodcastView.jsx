import PodcastGenerator from "./PodcastGenerator";
import PodcastList from "./PodcastList";

import { usePodcastData } from "@/hooks/usePodcastData";
import { usePodcastPlayer } from "@/hooks/usePodcastPlayer";
export default function PodcastView({
  notebook,
}) {
  const {
    podcasts,
    loading,
    submitting,
    error,
    createPodcast,
  } = usePodcastData(
    notebook?.id
  );

  const player =
    usePodcastPlayer();

  const hasGenerating =
    podcasts.some(
      (podcast) =>
        podcast.status ===
        "generating"
    );

  const handleDownload =
    (podcast) => {
      if (!podcast?.audioUrl) {
        return;
      }

      const link =
        document.createElement(
          "a"
        );

      link.href =
        podcast.audioUrl;

      link.target = "_blank";

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

  const handleGenerate =
    async (options) => {
      await createPodcast(
        options
      );
    };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <audio
        ref={player.audioRef}
        onTimeUpdate={
          player.handleTimeUpdate
        }
        onLoadedMetadata={
          player.handleLoadedMetadata
        }
        onEnded={
          player.handleEnded
        }
      />

      <div className="mx-auto max-w-2xl px-6 py-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold tracking-tight">
            Podcast Studio
          </h2>

          <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
            Turn your notebook into an
            audio overview
          </p>
        </div>

        <PodcastGenerator
          onGenerate={
            handleGenerate
          }
          submitting={submitting}
          hasGenerating={
            hasGenerating
          }
          error={error}
        />

        <div className="mt-7">
          <h3 className="mb-3 text-[0.8125rem] font-semibold text-muted-foreground">
            Recent podcasts
          </h3>

          <PodcastList
            podcasts={podcasts}
            loading={loading}
            playing={player.playing}
            progress={
              player.progress
            }
            currentTime={
              player.currentTime
            }
            audioDuration={
              player.audioDuration
            }
            onTogglePlay={
              player.togglePlay
            }
            onSeek={
              player.seek
            }
            onSkipBack={() =>
              player.skip(-10)
            }
            onSkipForward={() =>
              player.skip(10)
            }
            onDownload={
              handleDownload
            }
          />
        </div>
      </div>
    </div>
  );
}