import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";

import api from "@/services/api";

import {
  getNotebooks,
  createNotebook as createNotebookApi,
  updateNotebook,
  deleteNotebook as deleteNotebookApi,
  togglePinNotebook,
} from "@/services/notebook.service";

import { getSources } from "@/services/source.service";
import { useAppStore } from "@/store/appStore";

export function useNotebookData() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setActiveNotebookId = useAppStore(
    (state) => state.setActiveNotebookId
  );

  // ====================================================
  // AXIOS AUTH
  // ====================================================

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const interceptor = api.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [isLoaded, isSignedIn, getToken]);

  // ====================================================
  // LOAD MESSAGES
  // ====================================================

  const loadMessages = useCallback(async (notebookId) => {
    try {
      const res = await api.get(
        `/chat/${notebookId}/messages`
      );

      return (res.data ?? []).map((message) => ({
        id: message._id,
        role: message.role,
        content: message.content,
        citations: message.citations ?? [],
      }));
    } catch (error) {
      console.error("Failed to load messages:", error);
      return [];
    }
  }, []);

  // ====================================================
  // LOAD NOTEBOOKS
  // ====================================================

  const loadNotebooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getNotebooks();
      const notebookData = res.data ?? [];

      if (!notebookData.length) {
        setNotebooks([]);
        return;
      }

      const notebooksWithData = await Promise.all(
        notebookData.map(async (notebook) => {
          const [messages, sourcesRes] = await Promise.all([
            loadMessages(notebook._id),
            getSources(notebook._id),
          ]);

          return {
            ...notebook,
            id: notebook._id,
            isPinned: notebook.isPinned ?? false,
            sources: sourcesRes.data ?? [],
            messages,
          };
        })
      );

      const sortedNotebooks = notebooksWithData.sort(
        (a, b) => Number(b.isPinned) - Number(a.isPinned)
      );

      setNotebooks(sortedNotebooks);

      const currentActiveId =
        useAppStore.getState().activeNotebookId;

      const activeStillExists = sortedNotebooks.some(
        (notebook) => notebook.id === currentActiveId
      );

      if (!activeStillExists) {
        setActiveNotebookId(sortedNotebooks[0].id);
      }
    } catch (err) {
      console.error("Failed to load notebooks:", err);

      setError(
        err?.message || "Failed to load notebooks"
      );
    } finally {
      setLoading(false);
    }
  }, [loadMessages, setActiveNotebookId]);

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    loadNotebooks();
  }, [isLoaded, isSignedIn, loadNotebooks]);

  // ====================================================
  // CREATE
  // ====================================================

  const createNotebook = useCallback(async () => {
    try {
      const res = await createNotebookApi({
        title: "Untitled Notebook",
        emoji: "📒",
      });

      const notebook = {
        ...res.data,
        id: res.data._id,
        sources: [],
        messages: [],
        isPinned: false,
      };

      setNotebooks((prev) => [
        notebook,
        ...prev,
      ]);

      setActiveNotebookId(notebook.id);
    } catch (error) {
      console.error(
        "Failed to create notebook:",
        error
      );
    }
  }, [setActiveNotebookId]);

  // ====================================================
  // RENAME
  // ====================================================

  const renameNotebook = useCallback(
    async (id, title) => {
      let previous;

      setNotebooks((current) => {
        previous = current;

        return current.map((notebook) =>
          notebook.id === id
            ? { ...notebook, title }
            : notebook
        );
      });

      try {
        await updateNotebook(id, { title });
      } catch (error) {
        console.error(
          "Failed to rename notebook:",
          error
        );

        if (previous) {
          setNotebooks(previous);
        }
      }
    },
    []
  );

  // ====================================================
  // DELETE
  // ====================================================

  const deleteNotebook = useCallback(
    async (id) => {
      let previous = [];

      setNotebooks((current) => {
        previous = current;

        return current.filter(
          (notebook) => notebook.id !== id
        );
      });

      try {
        await deleteNotebookApi(id);

        if (
          useAppStore.getState().activeNotebookId === id
        ) {
          const remaining = previous.filter(
            (notebook) => notebook.id !== id
          );

          setActiveNotebookId(
            remaining[0]?.id ?? null
          );
        }
      } catch (error) {
        console.error(
          "Failed to delete notebook:",
          error
        );

        setNotebooks(previous);
      }
    },
    [setActiveNotebookId]
  );

  // ====================================================
  // PIN
  // ====================================================

  const togglePin = useCallback(async (id) => {
    let previous;

    setNotebooks((current) => {
      previous = current;

      return current
        .map((notebook) =>
          notebook.id === id
            ? {
                ...notebook,
                isPinned: !notebook.isPinned,
              }
            : notebook
        )
        .sort(
          (a, b) =>
            Number(b.isPinned) -
            Number(a.isPinned)
        );
    });

    try {
      await togglePinNotebook(id);
    } catch (error) {
      console.error(
        "Failed to pin notebook:",
        error
      );

      if (previous) {
        setNotebooks(previous);
      }
    }
  }, []);

  return {
    notebooks,
    setNotebooks,
    loading,
    error,

    createNotebook,
    renameNotebook,
    deleteNotebook,
    togglePin,

    reloadNotebooks: loadNotebooks,
  };
}