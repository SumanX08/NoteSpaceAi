import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  FileText,
  Globe,
  Database,
  FileCode,
  Type,
  Network,
  ListTree,
  Quote,
  ChevronRight,
} from "lucide-react";

import { KnowledgeGraph } from "./knowledge-graph";
import {
  sourceIcon,
  sourceTypeLabel,
  sourceTypeColor,
  statusMeta,
} from "@/lib/source-meta";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

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

export function RightPanel({ sources }) {
  const {
    panelMode,
    previewSource,
    hoveredCitation,
    setPanelMode,
    setPreviewSource,
    setRightPanelOpen,
  } = useAppStore();

  return (
    <aside className="flex h-full w-95 flex-col border-l border-border bg-background">
      <div className="flex h-12 shrink-0 items-center gap-1 border-b border-border px-3">
        <div className="flex flex-1 items-center gap-0.5 rounded-lg bg-muted/30 p-0.5">
          {modeTabs.map((tab) => {
            const Icon = tab.icon;

            const active =
              panelMode === tab.id ||
              (panelMode === "preview" && tab.id === "sources");

            return (
              <button
                key={tab.id}
                onClick={() => setPanelMode(tab.id)}
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
          onClick={() => setRightPanelOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={panelMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {panelMode === "sources" && (
              <SourcesList
                sources={sources}
                onPreview={(source) => {
                  setPreviewSource(source);
                  setPanelMode("preview");
                }}
              />
            )}

            {panelMode === "preview" && previewSource && (
              <SourcePreview source={previewSource} />
            )}

            {panelMode === "graph" && <KnowledgeGraph />}

            {panelMode === "citations" && (
              <CitationsList
                sources={sources}
                hovered={hoveredCitation}
                onPreview={(source) => {
                  setPreviewSource(source);
                  setPanelMode("preview");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}

function SourcesList({ sources, onPreview }) {
  console.log(sources)
  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-3 py-3">
      <p className="px-1 pb-2 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground-dim">
        {sources.length} sources
      </p>

      <div className="space-y-1.5">
        {sources.map((source) => {
          const Icon = sourceIcon[source.type];
          const meta = statusMeta[source.status];

          return (
            <button
              key={source.id}
              onClick={() => onPreview(source)}
              className="group flex w-full items-start gap-2.5 rounded-xl border border-border bg-card/30 p-3 text-left transition-all hover:border-border-strong hover:bg-card/60"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60",
                  sourceTypeColor[source.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] font-medium leading-snug">
                  {source.title}
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-[0.625rem] text-muted-foreground">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      meta.dot
                    )}
                  />

                  <span>{meta.label}</span>

                  <span className="text-muted-foreground-dim">
                    ·
                  </span>

                  <span>{sourceTypeLabel[source.type]}</span>
                </div>
              </div>

              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground-dim opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
function SourcePreview({ source }) {
  const Icon = sourceIcon[source.type];

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60",
              sourceTypeColor[source.type]
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[0.875rem] font-semibold leading-snug">
              {source.title}
            </h3>

            <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
              {sourceTypeLabel[source.type]}
              {source.pages && ` · ${source.pages} pages`}
              {source.duration && ` · ${source.duration}`}
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <button className="flex h-7 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[0.75rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ExternalLink className="h-3 w-3" />
            Open original
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        {source.preview?.kind === "pdf" && (
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="mb-3 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Page 21 of {source.pages}
            </div>

            <div className="space-y-3 text-[0.8125rem] leading-relaxed text-foreground/90">
              <p>{source.preview.content}</p>

              <p className="text-muted-foreground">
                The reconciliation algorithm compares the returned element tree
                with the previous one, marking subtrees as dirty when types or
                props differ. Memoization with{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.75em]">
                  React.memo
                </code>{" "}
                skips this comparison for referentially-equal props.
              </p>
            </div>
          </div>
        )}

        {source.preview?.kind === "website" && (
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="mb-3 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              {source.url}
            </div>

            <div className="space-y-3 text-[0.8125rem] leading-relaxed text-foreground/90">
              <p>{source.preview.content}</p>
            </div>
          </div>
        )}

        {source.preview?.kind === "youtube" && (
          <div className="space-y-3">
            <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-linear-to-br from-zinc-800 to-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 ring-1 ring-red-500/40">
                <Database className="h-5 w-5 text-red-300" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="mb-2 text-[0.6875rem] font-medium text-muted-foreground">
                Transcript
              </p>

              <pre className="whitespace-pre-wrap font-sans text-[0.8125rem] leading-relaxed text-foreground/90">
                {source.preview.content}
              </pre>
            </div>
          </div>
        )}

        {source.preview?.kind === "transcript" && (
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="mb-3 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
              <FileCode className="h-3.5 w-3.5" />
              Interview transcript · {source.duration}
            </div>

            <pre className="whitespace-pre-wrap font-sans text-[0.8125rem] leading-relaxed text-foreground/90">
              {source.preview.content}
            </pre>
          </div>
        )}

        {source.preview?.kind === "text" && (
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="mb-3 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
              <Type className="h-3.5 w-3.5" />
              Plain text · {source.size}
            </div>

            <p className="text-[0.8125rem] leading-relaxed text-foreground/90">
              {source.preview.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CitationsList({
  sources,
  hovered,
  onPreview,
}) {
  const allCitations = [
    {
      id: "c1",
      label: "PDF p.21",
      sourceId: "s2",
      detail: "Page 21 — Rendering cost",
    },
    {
      id: "c2",
      label: "Video 12:43",
      sourceId: "s3",
      detail: "useEffect cleanup demo",
    },
    {
      id: "c3",
      label: "Docs",
      sourceId: "s1",
      detail: "Hooks API reference",
    },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-3 py-3">
      <p className="px-1 pb-2 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground-dim">
        Citations in this answer
      </p>

      <div className="space-y-1.5">
        {allCitations.map((cite) => {
          const source = sources.find(
            (s) => s.id === cite.sourceId
          );

          if (!source) return null;

          const Icon = sourceIcon[source.type];

          // Fixed bug
          const active = hovered?.id === cite.id;

          return (
            <button
              key={cite.id}
              onClick={() => onPreview(source)}
              className={cn(
                "flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                active
                  ? "border-primary/50 bg-primary/10 shadow-glow"
                  : "border-border bg-card/30 hover:border-border-strong hover:bg-card/60"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60",
                  sourceTypeColor[source.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[0.625rem] font-medium text-primary">
                    {cite.label}
                  </span>
                </div>

                <p className="mt-1 truncate text-[0.8125rem] font-medium leading-snug">
                  {source.title}
                </p>

                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                  {cite.detail}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}