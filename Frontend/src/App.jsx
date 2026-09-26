import { Show } from "@clerk/react";

import "./App.css";

import LandingPage from "./pages/LandingPage";
import Sidebar from "./components/sidebar/Sidebar";
import { TopBar } from "./components/top-bar";
import { NavTabs } from "./components/nav-tabs";
import { RightPanel } from "./components/right-panel";

import { ChatView } from "./components/chat/ChatView";
import { SourceView } from "./components/sources/SourceView";
import { LearnView } from "./components/learn-view";
import PodcastView from "./components/podcast/PodcastView";

import { useAppStore } from "@/store/appStore";
import { useChatStore } from "@/store/chatStore";

import { useNotebookData } from "@/hooks/useNotebookData";
import { useChat } from "@/hooks/useChat";


function App() {
  return (
    <Show
      when="signed-in"
      fallback={<LandingPage />}
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

  


  // ====================================================
  // ACTIVE NOTEBOOK
  // ====================================================

  const activeNotebook =
    notebooks.find(
      (notebook) =>
        notebook.id === activeNotebookId
    ) ?? null;


const handleSourcesChange = (updatedSources) => {
  if (!activeNotebook) return;

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
     if (!activeNotebook) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="max-w-md text-center">

          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            No notebooks yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create your first workspace to start adding
            sources and chatting with your knowledge.
          </p>

          <button
            onClick={createNotebook}
            className="
              mt-6
              rounded-lg
              bg-primary
              px-5
              py-2.5
              text-sm
              font-medium
              text-primary-foreground
              shadow-soft
              transition-colors
              hover:bg-primary-hover
            "
          >
            Create your first notebook
          </button>

        </div>
      </div>
    );
  }
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
            sources={
              activeNotebook.sources ?? []
            }
            onSourcesChange={
              handleSourcesChange
            }
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
        onCreateNotebook={createNotebook}
        onRenameNotebook={renameNotebook}
        onDeleteNotebook={deleteNotebook}
        onTogglePin={togglePin}
      />

     <main className="flex min-w-0 flex-1 flex-col">

  {activeNotebook ? (
    <>
      <TopBar
        title={activeNotebook.title}
        emoji={activeNotebook.emoji}
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
              activeNotebook.sources ?? []
            }
          />
        )}

      </div>
    </>
  ) : (
    <div className="flex min-h-0 flex-1">
      {renderView()}
    </div>
  )}

</main>

    </div>
  );
}


export default App;