import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Network,
  ListTree,
  Quote,
} from "lucide-react";
import CitationsList from "./chat/markdown/CitationsList";
import { KnowledgeGraph } from "./knowledge-graph";
import SourceList from "./sources/SourceList";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const modeTabs = [
  {
    id: "sources",
    label: "Sources",
    icon: ListTree,
  },
  {
    id: "graph",
    label: "Graph",
    icon: Network,
  },
  {
    id: "citations",
    label: "Citations",
    icon: Quote,
  },
];



export function RightPanel({ sources = [] }) {
  const {
    panelMode,
    activeMessageCitations,
    selectedCitation,
    hoveredCitation,

    setPanelMode,
    setRightPanelOpen,
    setPreviewSource,
    setSelectedCitation,
  } = useAppStore();

  // Unique source IDs used in current answer
  const usedSourceIds = new Set(
    activeMessageCitations.map(
      (citation) =>
        String(citation.sourceId)
    )
  );

  // Only sources used in the current response
  const responseSources =
    sources.filter((source) =>
      usedSourceIds.has(
        String(source._id || source.id)
      )
    );

  return (
    <aside className="flex h-full w-95 flex-col border-l border-border bg-background">

      {/* HEADER */}
      <div className="flex h-12 shrink-0 items-center gap-1 border-b border-border px-3">

        <div className="flex flex-1 items-center gap-0.5 rounded-lg bg-muted/30 p-0.5">

          {modeTabs.map((tab) => {
            const Icon = tab.icon;

            const active =
              panelMode === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setPanelMode(tab.id)
                }
                className={cn(
                  "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md text-[0.75rem] font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />

                {tab.label}
              </button>
            );
          })}

        </div>

        <button
          onClick={() =>
            setRightPanelOpen(false)
          }
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden">

        <AnimatePresence mode="wait">

          <motion.div
            key={panelMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.15,
            }}
            className="h-full"
          >

            {/* SOURCES */}
            {panelMode === "sources" && (
              <SourceList
                sources={responseSources}
              />
            )}

            {/* GRAPH */}
            {panelMode === "graph" && (
              <KnowledgeGraph />
            )}

            {/* CITATIONS */}
            {panelMode === "citations" && (
              <CitationsList
                citations={activeMessageCitations}
                sources={sources}
                hovered={hoveredCitation}
                selectedCitation={selectedCitation}
                onCitationClick={(
                  citation,
                  source
                ) => {
                  setPreviewSource(source);
                  setSelectedCitation(citation);
                }}
              />
            )}

          </motion.div>

        </AnimatePresence>

      </div>

    </aside>
  );
}