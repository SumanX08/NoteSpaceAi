import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/sidebar/Sidebar";
import { TopBar } from "./components/top-bar";
import { NavTabs } from "./components/nav-tabs";
import { RightPanel } from "./components/right-panel";

import { ChatView } from "./components/chat/ChatView";
import { SourcesView } from "./components/sources-view";
import { LearnView } from "./components/learn-view";
import { PodcastView } from "./components/podcast-view";
import { askQuestion } from "@/services/chat";
import axios from "axios";

import {
  getNotebooks,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  togglePinNotebook,
} from "@/services/notebook.service";import { useAppStore } from "@/store/appStore";

function App() {

  const [notebooks, setNotebooks] = useState([]);

  

  const {
    activeNotebookId,
    activeTab,
    setActiveNotebookId,
    setActiveTab,
    rightPanelOpen,
  } = useAppStore();

  const handleSend = async (question) => {
   
  const userMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content: question,
  };

  setNotebooks((prev) =>
    prev.map((nb) =>
      nb.id === activeNotebookId
        ? {
            ...nb,
            messages: [...(nb.messages ?? []), userMessage],
          }
        : nb
    )
  );

   console.log("Sending",question)
  try {
   const res = await axios.post("http://localhost:5000/api/chat", {
  notebookId: activeNotebookId,
  question,
});

console.log(res.data);

const assistantMessage = {
  id: crypto.randomUUID(),
  role: "assistant",
  content: res.data.answer,
  citations: res.data.citations ?? [],
};
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebookId
          ? {
              ...nb,
              messages: [...(nb.messages ?? []), assistantMessage],
            }
          : nb
      )
    );
  } catch (err) {
    console.error(err);
  }
};

const loadNotebooks = async () => {
  const res = await getNotebooks();

  let notebooks = res.data;

  console.log(notebooks)
  if (notebooks.length === 0) {
    const created = await createNotebook({
      title: "My Notebook",
      emoji: "📒",

    });

    notebooks = [created.data];
    
  }

  console.log(notebooks)

 notebooks = notebooks
  .map((n) => ({
    ...n,
    id: n._id,
    isPinned: n.isPinned ?? false,
    sources: n.sources ?? [],
    messages: n.messages ?? [],
  }))
  .sort((a, b) => {
    if (a.isPinned === b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  });

  setNotebooks(notebooks);
  setActiveNotebookId(notebooks[0].id);
};
const handleCreateNotebook = async () => { 
  
  try {
    const res = await createNotebook({
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

    setNotebooks((prev) => [notebook, ...prev]);
    setActiveNotebookId(notebook.id);
  } catch (error) {
    console.error(error);
  }
};

const handleRenameNotebook = async (id, title) => {
  // optimistic update
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
    await updateNotebook(id, {
      title,
    });
  } catch (err) {
    console.error(err);

    loadNotebooks();
  }
};

const handleDeleteNotebook = async (id) => {
  const previous = notebooks;

  setNotebooks((prev) =>
    prev.filter((nb) => nb.id !== id)
  );

  try {
    await deleteNotebook(id);

    if (activeNotebookId === id) {
      const remaining = previous.filter(
        (nb) => nb.id !== id
      );

      if (remaining.length) {
        setActiveNotebookId(
          remaining[0].id
        );
      }
    }
  } catch (err) {
    console.error(err);

    setNotebooks(previous);
  }
};

const handleTogglePin = async (id) => {
  const previous = notebooks;

  const updated = notebooks
    .map((nb) =>
      nb.id === id
        ? {
            ...nb,
            isPinned: !nb.isPinned,
          }
        : nb
    )
    .sort((a, b) => {
      if (a.isPinned === b.isPinned) return 0;
      return a.isPinned ? -1 : 1;
    });

  setNotebooks(updated);

  try {
    await togglePinNotebook(id);
  } catch (err) {
    console.error(err);

    setNotebooks(previous);
  }
};


  const activeNotebook =
    notebooks.find((n) => n.id === activeNotebookId) ?? notebooks[0];

    useEffect(() => {
  loadNotebooks();
}, []);

  useEffect(() => {
    if (!activeNotebookId && notebooks.length) {
      setActiveNotebookId(notebooks[0].id);
    }
  }, [activeNotebookId, notebooks, setActiveNotebookId]);

if (!activeNotebook) {
  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      No notebooks found.
    </div>
  );
}
  const renderView = () => {
    switch (activeTab) {
      case "chat":
        return (
          <ChatView
            messages={activeNotebook.messages ?? []}
            notebookName={activeNotebook.title}
            sources={activeNotebook.sources ?? []}
            streaming={false}
            onSend={handleSend}
          />
        );

      case "sources":
        return (
          <SourcesView
            notebookId={activeNotebook.id}
            sources={activeNotebook.sources ?? []}
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

  return (
    <div className="flex h-screen bg-background">
<Sidebar
  notebooks={notebooks}
  onCreateNotebook={handleCreateNotebook}
  onRenameNotebook={handleRenameNotebook}
  onDeleteNotebook={handleDeleteNotebook}
  onTogglePin={handleTogglePin}
/>
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={activeNotebook.title}
          emoji={activeNotebook.emoji}
          onAddSource={() => setActiveTab("sources")}
        />

        <NavTabs />

        <div className="flex flex-1 overflow-hidden">
          <div className="min-w-0 flex-1">
            {renderView()}
          </div>

          {rightPanelOpen && (
            <RightPanel
              sources={activeNotebook.sources ?? []}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;