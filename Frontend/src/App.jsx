import { useEffect, useState } from "react";
import { Show, SignIn, useAuth } from "@clerk/react";

import "./App.css";

import api from "@/services/api";

import Sidebar from "./components/sidebar/Sidebar";
import { TopBar } from "./components/top-bar";
import { NavTabs } from "./components/nav-tabs";
import { RightPanel } from "./components/right-panel";

import { ChatView } from "./components/chat/ChatView";
import { SourceView } from "./components/sources/SourceView";
import { LearnView } from "./components/learn-view";
import { PodcastView } from "./components/podcast-view";

import {
  getNotebooks,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  togglePinNotebook,
} from "@/services/notebook.service";

import { useAppStore } from "@/store/appStore";


// ======================================================
// AUTH WRAPPER
// ======================================================

function App() {
  return (
    <Show
      when="signed-in"
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <SignIn />
        </div>
      }
    >
      <NotebookApp />
    </Show>
  );
}


// ======================================================
// MAIN APPLICATION
// ======================================================

function NotebookApp() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    activeNotebookId,
    activeTab,
    setActiveNotebookId,
    setActiveTab,
    rightPanelOpen,
  } = useAppStore();


  // ======================================================
  // SETUP CLERK TOKEN
  // ONLY ONE INTERCEPTOR
  // ======================================================

 useEffect(() => {

  if (!isLoaded || !isSignedIn) {
    return;
  }


  const interceptor =
    api.interceptors.request.use(
      async (config) => {

        const token =
          await getToken();

        console.log(
          "Token available:",
          !!token
        );


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


  // ======================================================
  // LOAD MESSAGES
  // ======================================================

 const loadMessages = async (
  notebookId
) => {

  try {

    console.log(
      "Loading messages:",
      notebookId
    );


    const res = await api.get(
      `/chat/${notebookId}/messages`
    );


    console.log(
      "Messages response:",
      res
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

};


  // ======================================================
  // LOAD NOTEBOOKS
  // ======================================================

  const loadNotebooks = async () => {

  try {

    setLoading(true);

    setError(null);


    const res =
      await getNotebooks();


    const notebookData =
      res.data ?? [];


    // No automatic notebook creation
    if (notebookData.length === 0) {

      setNotebooks([]);

      return;

    }


    const notebooksWithMessages =
      await Promise.all(

        notebookData.map(
          async (notebook) => {

            const messages =
              await loadMessages(
                notebook._id
              );


            return {

              ...notebook,

              id: notebook._id,

              isPinned:
                notebook.isPinned ?? false,

              sources:
                notebook.sources ?? [],

              messages,

            };

          }
        )

      );


    const sortedNotebooks =
      notebooksWithMessages.sort(
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

};


  // ======================================================
  // INITIALIZE APP
  // ======================================================

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    loadNotebooks();

  }, [isLoaded, isSignedIn]);


  // ======================================================
  // SEND QUESTION
  // ======================================================

  const handleSend = async (question) => {
    if (!activeNotebookId) {
      return;
    }


    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };


    // ----------------------------------------------
    // OPTIMISTIC USER MESSAGE
    // ----------------------------------------------

    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebookId
          ? {
              ...nb,

              messages: [
                ...(nb.messages ?? []),

                userMessage,
              ],
            }
          : nb
      )
    );


    try {
      console.log(
        "Sending question..."
      );


      const res = await api.post(
        "/chat",
        {
          notebookId:
            activeNotebookId,

          question,
        }
      );


      console.log(
        "Chat response:",
        res
      );


      const assistantMessage = {
        id: crypto.randomUUID(),

        role: "assistant",

        content: res.answer,

        citations:
          res.citations ?? [],
      };


      // ----------------------------------------------
      // ADD ASSISTANT MESSAGE
      // ----------------------------------------------

      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === activeNotebookId
            ? {
                ...nb,

                messages: [
                  ...(nb.messages ?? []),

                  assistantMessage,
                ],
              }
            : nb
        )
      );

    } catch (error) {
      console.error(
        "Failed to send question:",
        error
      );
    }
  };


  // ======================================================
  // CREATE NOTEBOOK
  // ======================================================

  const handleCreateNotebook =
    async () => {
      try {
        const res =
          await createNotebook({
            title:
              "Untitled Notebook",

            emoji: "📒",
          });


        const notebook = {
          ...res.data,

          id:
            res.data._id,

          sources: [],

          messages: [],

          isPinned: false,
        };


        setNotebooks((prev) => [
          notebook,
          ...prev,
        ]);


        setActiveNotebookId(
          notebook.id
        );

      } catch (error) {
        console.error(
          "Failed to create notebook:",
          error
        );
      }
    };


  // ======================================================
  // RENAME NOTEBOOK
  // ======================================================

  const handleRenameNotebook =
    async (id, title) => {

      const previous =
        notebooks;


      setNotebooks((prev) =>
        prev.map((nb) =>
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
    };


  // ======================================================
  // DELETE NOTEBOOK
  // ======================================================

  const handleDeleteNotebook =
    async (id) => {

      const previous =
        notebooks;


      setNotebooks((prev) =>
        prev.filter(
          (nb) =>
            nb.id !== id
        )
      );


      try {
        await deleteNotebook(id);


        if (
          activeNotebookId === id
        ) {
          const remaining =
            previous.filter(
              (nb) =>
                nb.id !== id
            );


          if (
            remaining.length > 0
          ) {
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
    };


  // ======================================================
  // PIN NOTEBOOK
  // ======================================================

  const handleTogglePin =
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
        await togglePinNotebook(id);

      } catch (error) {
        console.error(
          "Failed to pin notebook:",
          error
        );

        setNotebooks(
          previous
        );
      }
    };


  // ======================================================
  // LOADING STATES
  // ======================================================

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Loading notebooks...
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-red-500">
        {error}
      </div>
    );
  }


  if (!notebooks.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        No notebooks found.
      </div>
    );
  }


  // ======================================================
  // ACTIVE NOTEBOOK
  // ======================================================

  const activeNotebook =
    notebooks.find(
      (notebook) =>
        notebook.id ===
        activeNotebookId
    ) ?? notebooks[0];


  // ======================================================
  // RENDER ACTIVE VIEW
  // ======================================================

  const renderView = () => {
    switch (activeTab) {

      case "chat":
        return (
          <ChatView
            messages={
              activeNotebook.messages ?? []
            }

            notebookName={
              activeNotebook.title
            }

            sources={
              activeNotebook.sources ?? []
            }

            streaming={false}

            onSend={
              handleSend
            }
          />
        );


      case "sources":
        return (
          <SourceView
            notebookId={
              activeNotebook.id
            }

            sources={
              activeNotebook.sources ?? []
            }
          />
        );


      case "learn":
        return (
          <LearnView
            notebook={
              activeNotebook
            }
          />
        );


      case "podcast":
        return (
          <PodcastView
            notebook={
              activeNotebook
            }
          />
        );


      default:
        return null;
    }
  };


  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="flex h-screen bg-background">

      <Sidebar
        notebooks={notebooks}

        onCreateNotebook={
          handleCreateNotebook
        }

        onRenameNotebook={
          handleRenameNotebook
        }

        onDeleteNotebook={
          handleDeleteNotebook
        }

        onTogglePin={
          handleTogglePin
        }
      />


      <main className="flex min-w-0 flex-1 flex-col">

        <TopBar
          title={
            activeNotebook.title
          }

          emoji={
            activeNotebook.emoji
          }

          onAddSource={() =>
            setActiveTab(
              "sources"
            )
          }
        />


        <NavTabs />


        <div className="flex flex-1 overflow-hidden">

          <div className="min-w-0 flex-1">
            {renderView()}
          </div>


          {rightPanelOpen && (
            <RightPanel
              sources={
                activeNotebook.sources ?? []
              }
            />
          )}

        </div>

      </main>

    </div>
  );
}


export default App;