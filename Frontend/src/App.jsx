import { Show, SignIn } from "@clerk/react";

import "./App.css";

import Sidebar from "./components/sidebar/Sidebar";
import { TopBar } from "./components/top-bar";
import { NavTabs } from "./components/nav-tabs";
import { RightPanel } from "./components/right-panel";

import { ChatView } from "./components/chat/ChatView";
import { SourceView } from "./components/sources/SourceView";
import { LearnView } from "./components/learn-view";
import { PodcastView } from "./components/podcast-view";

import { useAppStore } from "@/store/appStore";
import { useChatStore } from "@/store/chatStore";

import { useNotebookData } from "@/hooks/useNotebookData";
import { useChat } from "@/hooks/useChat";


// ======================================================
// AUTH
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
// NOTEBOOK APP
// ======================================================

function NotebookApp() {
  const {
    activeNotebookId,
    activeTab,
    setActiveTab,
    rightPanelOpen,
  } = useAppStore();

  const streaming = useChatStore(
    (state) => state.isStreaming
  );


  // ====================================================
  // NOTEBOOK DATA
  // ====================================================

  const {
    notebooks,
    setNotebooks,
    loading,
    error,

    createNotebook,
    renameNotebook,
    deleteNotebook,
    togglePin,
  } = useNotebookData();


  // ====================================================
  // CHAT
  // ====================================================

  const { sendMessage } = useChat({
    activeNotebookId,
    setNotebooks,
  });


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Loading notebooks...
      </div>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-red-500">
        {error}
      </div>
    );
  }


  // ====================================================
  // EMPTY
  // ====================================================

  if (!notebooks.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        No notebooks found.
      </div>
    );
  }


  // ====================================================
  // ACTIVE NOTEBOOK
  // ====================================================

  const activeNotebook =
    notebooks.find(
      (notebook) =>
        notebook.id ===
        activeNotebookId
    ) ?? notebooks[0];

    const handleSourcesChange = (updatedSources) => {
  setNotebooks((currentNotebooks) =>
    currentNotebooks.map((notebook) =>
      notebook.id === activeNotebook.id
        ? {
            ...notebook,
            sources: updatedSources,
          }
        : notebook
    )
  );
};


  // ====================================================
  // ACTIVE VIEW
  // ====================================================

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
            streaming={streaming}
            onSend={sendMessage}
          />
        );

      case "sources":
        return (
          <SourceView
  notebookId={activeNotebook.id}
  sources={activeNotebook.sources ?? []}
  onSourcesChange={handleSourcesChange}
/>
        );

      case "learn":
        return (
          <LearnView
            notebook={activeNotebook}
          />
        );

      case "podcast":
        return (
          <PodcastView
            notebook={activeNotebook}
          />
        );

      default:
        return null;
    }
  };


  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="flex h-screen bg-background">

      <Sidebar
        notebooks={notebooks}
        onCreateNotebook={
          createNotebook
        }
        onRenameNotebook={
          renameNotebook
        }
        onDeleteNotebook={
          deleteNotebook
        }
        onTogglePin={
          togglePin
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
            setActiveTab("sources")
          }
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">

          <div className="flex min-w-0 flex-1 flex-col">

            <NavTabs />

            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              {renderView()}
            </div>

          </div>

          {rightPanelOpen && (
            <RightPanel
              sources={
                activeNotebook.sources ??
                []
              }
            />
          )}

        </div>

      </main>

    </div>
  );
}


export default App;