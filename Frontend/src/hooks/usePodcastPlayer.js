import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function usePodcastPlayer() {
  const audioRef =
    useRef(null);

  const [playing, setPlaying] =
    useState(null);

  const [progress, setProgress] =
    useState(0);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [audioDuration, setAudioDuration] =
    useState(0);

  /*
   * ============================================
   * PLAY / PAUSE
   * ============================================
   */

  const togglePlay =
    useCallback(
      async (podcast) => {
        const audio =
          audioRef.current;

        if (
          !audio ||
          !podcast?.audioUrl
        ) {
          return;
        }

        try {
          /*
           * Pause current podcast.
           */
          if (
            playing === podcast.id
          ) {
            audio.pause();
            setPlaying(null);
            return;
          }

          /*
           * Stop previous audio.
           */
          audio.pause();

          /*
           * Load new podcast.
           */
          audio.src =
            podcast.audioUrl;

          audio.load();

          setCurrentTime(0);
          setProgress(0);
          setAudioDuration(0);

          await audio.play();

          setPlaying(
            podcast.id
          );
        } catch (error) {
          console.error(
            "Audio playback failed:",
            error
          );

          setPlaying(null);
          throw error;
        }
      },
      [playing]
    );

  /*
   * ============================================
   * TIME UPDATE
   * ============================================
   */

  const handleTimeUpdate =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

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
    }, []);

  /*
   * ============================================
   * METADATA
   * ============================================
   */

  const handleLoadedMetadata =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      if (
        Number.isFinite(
          audio.duration
        )
      ) {
        setAudioDuration(
          audio.duration
        );
      }
    }, []);

  /*
   * ============================================
   * ENDED
   * ============================================
   */

  const handleEnded =
    useCallback(() => {
      setPlaying(null);
      setProgress(0);
      setCurrentTime(0);
    }, []);

  /*
   * ============================================
   * SEEK
   * ============================================
   */

  const seek =
    useCallback((value) => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

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
    }, []);

  /*
   * ============================================
   * SKIP
   * ============================================
   */

  const skip =
    useCallback((seconds) => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      const newTime =
        Math.max(
          0,
          Math.min(
            audio.duration || 0,
            audio.currentTime +
              seconds
          )
        );

      audio.currentTime =
        newTime;

      setCurrentTime(
        newTime
      );

      if (
        audio.duration > 0
      ) {
        setProgress(
          (newTime /
            audio.duration) *
            100
        );
      }
    }, []);

  /*
   * Cleanup audio when hook is
   * unmounted.
   */
  useEffect(() => {
    return () => {
      const audio =
        audioRef.current;

      if (audio) {
        audio.pause();
        audio.removeAttribute(
          "src"
        );
        audio.load();
      }
    };
  }, []);

  return {
    audioRef,
    playing,
    progress,
    currentTime,
    audioDuration,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    seek,
    skip,
  };
}