import { useMemo } from "react";
import { motion } from "framer-motion";
import {Plus,Search,Settings,Sparkles,ChevronRight,Hash,} from "lucide-react";


import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

export default function Sidebar({
  notebooks,
  onCreateNotebook,
  collapsed = false,
}) {
  const activeNotebookId = useAppStore(
    (state) => state.activeNotebookId
  );

  const setActiveNotebookId = useAppStore(
    (state) => state.setActiveNotebookId
  );

  const recent = useMemo(
    () => notebooks.slice(0, 4),
    [notebooks]
  );

  if (collapsed) {
    return (
      <aside className="flex h-full w-14 flex-col items-center gap-3 border-r border-border bg-background py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>

        <div className="mt-2 flex-1 space-y-2">
          {notebooks.slice(0, 5).map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveNotebookId(n.id)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors",
                n.id === activeNotebookId
                  ? "bg-primary/15 ring-1 ring-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={n.title}
            >
              {n.emoji}
            </button>
          ))}
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>

        <span className="text-[15px] font-semibold tracking-tight">
          Lumen
        </span>

        <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
          Pro
        </span>
      </div>

      <div className="px-3 pb-2">
        <button className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground hover:bg-muted">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
        </button>
      </div>

      <div className="px-3 pb-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onCreateNotebook}
          className="flex h-9 w-full items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          New Notebook
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <SectionLabel>Workspace</SectionLabel>

        <div className="space-y-0.5">
          {notebooks.map((notebook) => (
            <NotebookRow
              key={notebook.id}
              sourceCount={notebook.sourceCount}
              notebook={notebook}
              active={notebook.id === activeNotebookId}
              onClick={() =>
                setActiveNotebookId(notebook.id)
              }
            />
          ))}
        </div>

        <div className="mt-5">
          <SectionLabel>Recent</SectionLabel>

          <div className="space-y-0.5">
            {recent.map((notebook) => (
              <button
                key={notebook.id}
                onClick={() =>
                  setActiveNotebookId(notebook.id)
                }
                className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.8125rem] text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Hash className="h-3 w-3 text-muted-foreground-dim" />

                <span className="truncate">
                  {notebook.title}
                </span>

                <span className="ml-auto text-[0.625rem] text-muted-foreground-dim opacity-0 group-hover:opacity-100">
                  {notebook.updated}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-zinc-600 to-zinc-800 text-[0.625rem] font-semibold text-white">
            AK
          </div>

          <div className="flex flex-col items-start">
            <span className="text-[0.8125rem] font-medium text-foreground">
              Alex Kim
            </span>

            <span className="text-[0.6875rem] text-muted-foreground">
              alex@lumen.io
            </span>
          </div>

          <Settings className="ml-auto h-4 w-4 text-muted-foreground-dim" />
        </button>
      </div>
    </aside>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="px-2 pb-1.5 pt-3 text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground-dim">
      {children}
    </p>
  );
}

function NotebookRow({ notebook, active, onClick,sourceCount }) {

  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="active-notebook"
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      <span className="text-base leading-none">{notebook.emoji}</span>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[0.8125rem] font-medium">
          {notebook.title}
        </span>

        <span className="truncate text-[0.6875rem] text-muted-foreground-dim">
          {sourceCount?? 0}  sources · {notebook.updated}
        </span>
      </div>

      <ChevronRight
        className={cn(
          "h-3.5 w-3.5 shrink-0 text-muted-foreground-dim transition-all",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        )}
      />
    </button>
  );    
}