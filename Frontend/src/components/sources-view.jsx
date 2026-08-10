import { useState,useEffect,useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  ExternalLink,
  X,
  FileText,
  Globe,
  
  FileCode,
  Type,
  Upload,
  Database,
  File,
} from "lucide-react";

import { uploadSource, getSources } from "@/services/source.service";

import { Progress } from "@/components/ui/progress";
import {
  sourceIcon,
  sourceTypeLabel,
  sourceTypeColor,
  statusMeta,
} from "@/lib/source-meta";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

const addOptions = [
  {
    type: "pdf",
    label: "PDF",
    icon: FileText,
    desc: "Upload a document",
  },
  {
    type: "website",
    label: "Website",
    icon: Globe,
    desc: "Crawl a URL",
  },
  {
    type: "youtube",
    label: "YouTube",
    icon: Database,
    desc: "Paste a video link",
  },
  {
    type: "transcript",
    label: "Transcript",
    icon: FileCode,
    desc: "Add a transcript",
  },
  {
    type: "text",
    label: "Plain Text",
    icon: Type,
    desc: "Paste raw text",
  },
];

export function SourcesView({sources = [],notebookId}) {
  const [pickerOpen, setPickerOpen] =useState(false);
  const [uploading, setUploading] = useState(false);
const [sourceList, setSourceList] = useState(sources);


  const {
    setPanelMode,
    setPreviewSource,
    setActiveTab,
  } = useAppStore();

  useEffect(() => {
  if (!notebookId) return;

  let interval;

  const loadSources = async () => {
    try {
      const res = await getSources(notebookId);

      setSourceList(res.data ?? []);

      const hasProcessing = (res.data ?? []).some((source) =>
        ["uploading", "processing"].includes(source.status)
      );

      if (!hasProcessing && interval) {
        clearInterval(interval);
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadSources();

  interval = setInterval(loadSources, 3000);

  return () => clearInterval(interval);
}, [notebookId]);

  const readyCount = sourceList.filter(
    (s) => s.status === "ready"
  ).length;


  return (
    <div className="relative h-full">
      <div className="mx-auto h-full max-w-4xl px-6 py-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Sources
            </h2>

            <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
              {sources.length} sources ·{" "}
              {readyCount} ready
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FilterChip
              label="All"
              active
            />

            <FilterChip label="Ready" />

            <FilterChip label="Processing" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sourceList.map(
            (source, index) => (
              <motion.div
                key={source.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.04,
                  duration: 0.25,
                }}
              >
                <SourceCard
                  source={source}
                />
              </motion.div>
            )
          )}
        </div>
      </div>

      <motion.button
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.97,
        }}
        onClick={() =>
          setPickerOpen(true)
        }
        className="absolute bottom-6 right-6 flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-elevated transition-colors hover:bg-primary-hover"
      >
        <Plus className="h-4 w-4" />
        Add Source
      </motion.button>

      <AnimatePresence>
        {pickerOpen && (
          <SourcePicker
  notebookId={notebookId}
  setUploading={setUploading}
  setSourceList={setSourceList}
  onClose={() => setPickerOpen(false)}
  onPick={() => {
    setPickerOpen(false);
    setActiveTab("sources");
  }}
/>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  label,
  active,
}) {
  return (
    <button
      className={cn(
        "rounded-full px-3 py-1 text-[0.75rem] font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "border border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function SourceCard({
  source,
}) {
  const {
    setPanelMode,
    setPreviewSource,
  } = useAppStore();

  const Icon =
    sourceIcon[source.type]||File;

  const meta =
    statusMeta[source.status];

  const processing =
    source.status ===
      "indexing" ||
    source.status ===
      "uploading";

  return (
        <div
      className="group rounded-2xl border border-border bg-card/40 p-4 transition-all hover:border-border-strong hover:bg-card/70"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60",
            sourceTypeColor[source.type]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[0.875rem] font-medium leading-snug">
            {source.title}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
            <span>{sourceTypeLabel[source.type]}</span>

            <span className="text-muted-foreground-dim">
              ·
            </span>

            <span>{source.addedAt}</span>

            {source.pages && (
              <>
                <span className="text-muted-foreground-dim">
                  ·
                </span>

                <span>
                  {source.pages} pages
                </span>
              </>
            )}

            {source.duration && (
              <>
                <span className="text-muted-foreground-dim">
                  ·
                </span>

                <span>
                  {source.duration}
                </span>
              </>
            )}
          </div>
        </div>

        <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground-dim opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3.5">
        {processing ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[0.6875rem]">
              <span
                className={cn(
                  "flex items-center gap-1.5 font-medium",
                  meta.text
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    meta.dot
                  )}
                />

                {meta.label}…
                {source.progress}%
              </span>

              <span className="text-muted-foreground-dim">
                Indexing chunks
              </span>
            </div>

            <Progress
              value={source.progress}
              className="h-1"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium",
                meta.bg,
                meta.text
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  meta.dot
                )}
              />

              {meta.label}
            </span>

            <button
              onClick={() => {
                setPreviewSource(
                  source
                );
                setPanelMode(
                  "preview"
                );
              }}
              className="flex items-center gap-1 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Preview

              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SourcePicker({  notebookId,
  setUploading,
  setSourceList,
  onClose,
  onPick,
}) {
const inputRef = useRef(null);
const [selectedType, setSelectedType] = useState(null);
const [url, setUrl] = useState("");
const [text, setText] = useState("");

const handleFile = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
formData.append("notebookId", notebookId);
formData.append("type", selectedType);

    try {
        setUploading(true);

        await uploadSource(formData);

        const res = await getSources(notebookId);

        setSourceList(res.data);

        onClose();
    } catch (err) {
        console.error(err);
    } finally {
        setUploading(false);
    }
};
const handleWebsite = async () => {
  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("notebookId", notebookId);
    formData.append("type", "website");
    formData.append("url", url);
    console.log(url)

    await uploadSource(formData);

    const res = await getSources(notebookId);
    setSourceList(res.data);

    onClose();
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};
const handleYoutube = async () => {
  if (!url.trim()) return;

  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("notebookId", notebookId);
    formData.append("type", "youtube");
    formData.append("url", url.trim());

    await uploadSource(formData);

    const res = await getSources(notebookId);

    setSourceList(res.data);

    onClose();
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};

{
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      onClick={onClose}
      className="absolute inset-0 z-30 flex items-center justify-center bg-background/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 8,
        }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="w-full max-w-md rounded-2xl border border-border bg-popover p-5 shadow-elevated"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFile}
        />

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[0.9375rem] font-semibold">
            Add a source
          </h3>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {addOptions.map(
            (option) => {
              const Icon =
                option.icon;

              return (
                <button
                  key={
                    option.type
                  }
                  onClick={() => {
  setSelectedType(option.type);

  if (["pdf", "docx", "transcript"].includes(option.type)) {
    inputRef.current.click();
  }
}}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 text-left transition-all hover:border-primary/40 hover:bg-card"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[0.8125rem] font-medium">
                      {option.label}
                    </p>

                    <p className="text-[0.6875rem] text-muted-foreground">
                      {option.desc}
                    </p>
                  </div>

                  <Upload className="h-3.5 w-3.5 text-muted-foreground-dim opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            }
          )}

          {selectedType === "website" && (
  <div className="mt-4 space-y-2">
    <input
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://..."
      className="w-full rounded-lg border p-2"
    />

    <button
      onClick={handleWebsite}
      className="w-full rounded-lg bg-primary p-2 text-primary-foreground"
    >
      Add Website
    </button>
  </div>
)}
{selectedType === "youtube" && (
  <div className="mt-4 space-y-2">
    <input
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://www.youtube.com/watch?v=..."
      className="w-full rounded-lg border p-2"
    />

    <button
      onClick={handleYoutube}
      disabled={!url.trim() }
      className="w-full rounded-lg bg-primary p-2 text-primary-foreground disabled:opacity-50"
    >
    </button>
  </div>
)}

        </div>
      </motion.div>
    </motion.div>
  )}
}