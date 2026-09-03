import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";

import {
  getNotebooks,
  createNotebook as createNotebookApi,
  updateNotebook,
  deleteNotebook as deleteNotebookApi,
  togglePinNotebook,
} from "@/services/notebook.service";

import { getSources } from "@/services/source.service";
import api from "@/services/api";

import { useAppStore } from "@/store/appStore";


// ======================================================
// NOTEBOOK DATA HOOK
// ======================================================

export function useNotebookData() {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    setActiveNotebookId,
  } = useAppStore();


  // ====================================================
  // CLERK / AXIOS AUTH
  // ====================================================

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const interceptor =
      api.interceptors.request.use(
        async (config) => {
          const token =
            await getToken();

          if (token) {
            config.headers =
              config.headers || {};

            config.headers.Authorization =
              `Bearer ${token}`;
          }

          return config;
        }
      );

    return () => {
      api.interceptors.request.eject(
        interceptor
      );
    };
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);


  // ====================================================
  // LOAD MESSAGES
  // ====================================================

  const loadMessages = useCallback(
    async (notebookId) => {
      try {
        const res = await api.get(
          `/chat/${notebookId}/messages`
        );

        return (res.data ?? []).map(
          (message) => ({
            id: message._id,
            role: message.role,
            content: message.content,
            citations:
              message.citations ?? [],
          })
        );
      } catch (error) {
        console.error(
          "Failed to load messages:",
          error
        );

        return [];
      }
    },
    []
  );


  // ====================================================
  // LOAD NOTEBOOKS
  // ====================================================

  const loadNotebooks = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const res =
          await getNotebooks();

        const notebookData =
          res.data ?? [];

        if (!notebookData.length) {
          setNotebooks([]);
          return;
        }

        const notebooksWithData =
          await Promise.all(
            notebookData.map(
              async (notebook) => {
                const [
                  messages,
                  sourcesRes,
                ] = await Promise.all([
                  loadMessages(
                    notebook._id
                  ),
                  getSources(
                    notebook._id
                  ),
                ]);

                return {
                  ...notebook,

                  id: notebook._id,

                  isPinned:
                    notebook.isPinned ??
                    false,

                  sources:
                    sourcesRes.data ??
                    [],

                  messages,
                };
              }
            )
          );

        const sortedNotebooks =
          notebooksWithData.sort(
            (a, b) => {
              if (
                a.isPinned ===
                b.isPinned
              ) {
                return 0;
              }

              return a.isPinned
                ? -1
                : 1;
            }
          );

        setNotebooks(
          sortedNotebooks
        );

        setActiveNotebookId(
          sortedNotebooks[0].id
        );
      } catch (err) {
        console.error(
          "Failed to load notebooks:",
          err
        );

        setError(
          err?.message ||
          "Failed to load notebooks"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      loadMessages,
      setActiveNotebookId,
    ]
  );


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    if (
      !isLoaded ||
      !isSignedIn
    ) {
      return;
    }

    loadNotebooks();
  }, [
    isLoaded,
    isSignedIn,
    loadNotebooks,
  ]);


  // ====================================================
  // CREATE NOTEBOOK
  // ====================================================

  const createNotebook =
    useCallback(
      async () => {
        try {
          const res =
            await createNotebookApi({
              title:
                "Untitled Notebook",
              emoji: "📒",
            });

          const notebook = {
            ...res.data,

            id: res.data._id,

            sources: [],
            messages: [],

            isPinned: false,
          };

          setNotebooks(
            (prev) => [
              notebook,
              ...prev,
            ]
          );

          setActiveNotebookId(
            notebook.id
          );
        } catch (error) {
          console.error(
            "Failed to create notebook:",
            error
          );
        }
      },
      [setActiveNotebookId]
    );


  // ====================================================
  // RENAME NOTEBOOK
  // ====================================================

  const renameNotebook =
    useCallback(
      async (id, title) => {
        const previous =
          notebooks;

        setNotebooks(
          (prev) =>
            prev.map(
              (nb) =>
                nb.id === id
                  ? {
                      ...nb,
                      title,
                    }
                  : nb
            )
        );

        try {
          await updateNotebook(
            id,
            { title }
          );
        } catch (error) {
          console.error(
            "Failed to rename notebook:",
            error
          );

          setNotebooks(
            previous
          );
        }
      },
      [notebooks]
    );


  // ====================================================
  // DELETE NOTEBOOK
  // ====================================================

  const deleteNotebook =
    useCallback(
      async (id) => {
        const previous =
          notebooks;

        setNotebooks(
          (prev) =>
            prev.filter(
              (nb) =>
                nb.id !== id
            )
        );

        try {
          await deleteNotebookApi(
            id
          );

          if (
            useAppStore.getState()
              .activeNotebookId === id
          ) {
            const remaining =
              previous.filter(
                (nb) =>
                  nb.id !== id
              );

            if (remaining.length) {
              setActiveNotebookId(
                remaining[0].id
              );
            }
          }
        } catch (error) {
          console.error(
            "Failed to delete notebook:",
            error
          );

          setNotebooks(
            previous
          );
        }
      },
      [
        notebooks,
        setActiveNotebookId,
      ]
    );


  // ====================================================
  // PIN NOTEBOOK
  // ====================================================

  const togglePin =
    useCallback(
      async (id) => {
        const previous =
          notebooks;

        const updated =
          notebooks
            .map((nb) =>
              nb.id === id
                ? {
                    ...nb,
                    isPinned:
                      !nb.isPinned,
                  }
                : nb
            )
            .sort((a, b) => {
              if (
                a.isPinned ===
                b.isPinned
              ) {
                return 0;
              }

              return a.isPinned
                ? -1
                : 1;
            });

        setNotebooks(
          updated
        );

        try {
          await togglePinNotebook(
            id
          );
        } catch (error) {
          console.error(
            "Failed to pin notebook:",
            error
          );

          setNotebooks(
            previous
          );
        }
      },
      [notebooks]
    );


  return {
    notebooks,
    setNotebooks,

    loading,
    error,

    createNotebook,
    renameNotebook,
    deleteNotebook,
    togglePin,

    reloadNotebooks:
      loadNotebooks,
  };
}