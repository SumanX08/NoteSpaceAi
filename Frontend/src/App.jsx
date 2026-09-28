import { Show } from "@clerk/react";

import "./App.css";

import LandingPage from "./pages/LandingPage";
import Sidebar from "./components/sidebar/Sidebar";
import { TopBar } from "./components/top-bar";
import { NavTabs } from "./components/nav-tabs";
import { RightPanel } from "./components/right-panel";
import EmptyNotebook from "./components/chat/EmptyNotebook";

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
      <EmptyNotebook
        onCreateNotebook={createNotebook}
      />
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

    {/* ==========================================
        SIDEBAR
    ========================================== */}

    <Sidebar
      notebooks={notebooks}
      onCreateNotebook={createNotebook}
      onRenameNotebook={renameNotebook}
      onDeleteNotebook={deleteNotebook}
      onTogglePin={togglePin}
    />


    {/* ==========================================
        MAIN APP
    ========================================== */}

    <main className="flex min-w-0 flex-1 flex-col">

      {/* TOP BAR */}

      <TopBar

          notebookId={activeNotebook.id}

        title={
          activeNotebook?.title ??
          "No workspace"
        }
        emoji={
          activeNotebook?.emoji ??
          "📓"
        }
        onAddSource={() => {
          if (activeNotebook) {
            setActiveTab("sources");
          }
        }}
      />


      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ======================================
            CENTER
        ====================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          <NavTabs />

          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            {renderView()}
          </div>

        </div>


        {/* ======================================
            RIGHT PANEL
        ====================================== */}

        {rightPanelOpen && (
          <RightPanel
            sources={
              activeNotebook?.sources ?? []
            }
          />
        )}

      </div>

    </main>

  </div>
);
}


export default App;