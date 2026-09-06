import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  generatePodcast,
  getPodcasts,
} from "@/services/podcast.service";

import { normalizePodcast } from "@/components/podcast/podcast.utils";

export function usePodcastData(notebookId) {
  const [podcasts, setPodcasts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const pollingRef =
    useRef(null);

  const loadPodcasts = useCallback(
    async (showLoading = false) => {
      if (!notebookId) {
        return [];
      }

      try {
        if (showLoading) {
          setLoading(true);
          setError("");
        }

        const res =
          await getPodcasts(notebookId);

        const data =
          res?.data ?? [];

        const normalized =
          data.map(normalizePodcast);

        setPodcasts(normalized);

        return normalized;
      } catch (error) {
        console.error(
          "Failed to load podcasts:",
          error
        );

        if (showLoading) {
          setError(
            error?.message ||
              "Failed to load podcasts."
          );
        }

        return [];
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [notebookId]
  );

  /*
   * Initial load whenever the notebook
   * changes.
   */
  useEffect(() => {
    if (!notebookId) {
      setPodcasts([]);
      setLoading(false);
      return;
    }

    loadPodcasts(true);
  }, [
    notebookId,
    loadPodcasts,
  ]);

  /*
   * Background polling.
   *
   * Only poll while at least one podcast
   * is being generated.
   */
  useEffect(() => {
    const hasGenerating =
      podcasts.some(
        (podcast) =>
          podcast.status ===
          "generating"
      );

    if (!notebookId || !hasGenerating) {
      if (pollingRef.current) {
        clearInterval(
          pollingRef.current
        );

        pollingRef.current = null;
      }

      return;
    }

    if (pollingRef.current) {
      return;
    }

    pollingRef.current =
      setInterval(() => {
        loadPodcasts(false);
      }, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(
          pollingRef.current
        );

        pollingRef.current = null;
      }
    };
  }, [
    notebookId,
    podcasts,
    loadPodcasts,
  ]);

  /*
   * Start a new podcast.
   *
   * The backend returns immediately with
   * status = generating.
   */
  const createPodcast =
    useCallback(
      async ({
        style,
        voice,
        duration,
      }) => {
        if (!notebookId) {
          throw new Error(
            "No active notebook selected."
          );
        }

        if (submitting) {
          return;
        }

        try {
          setSubmitting(true);
          setError("");

          const res =
            await generatePodcast(
              notebookId,
              {
                style,
                voice,
                duration,
              }
            );

          const podcast =
            res?.data;

          if (!podcast) {
            throw new Error(
              "Podcast generation returned no data."
            );
          }

          const normalized =
            normalizePodcast(
              podcast
            );

          setPodcasts(
            (current) => {
              const exists =
                current.some(
                  (item) =>
                    item.id ===
                    normalized.id
                );

              if (exists) {
                return current;
              }

              return [
                normalized,
                ...current,
              ];
            }
          );

          return normalized;
        } catch (error) {
          console.error(
            "Failed to start podcast generation:",
            error
          );

          const message =
            error?.message ||
            "Failed to generate podcast.";

          setError(message);

          throw error;
        } finally {
          setSubmitting(false);
        }
      },
      [notebookId, submitting]
    );

  return {
    podcasts,
    loading,
    submitting,
    error,
    createPodcast,
  };
}