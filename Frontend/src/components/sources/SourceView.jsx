import { useState, useEffect } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  getSources,
  deleteSource,
} from "@/services/source.service";

import FilterChip from "./FilterChip";
import SourceCard from "./SourceCard";
import SourcePicker from "./SourcePicker";

import { Plus } from "lucide-react";

import { useAppStore } from "@/store/appStore";


export function SourceView({
  sources = [],
  notebookId,
  onSourcesChange,
}) {
  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [sourceList, setSourceList] =
    useState(sources);


  const {
    setActiveTab,
  } = useAppStore();


  // ==========================================
  // DELETE SOURCE
  // ==========================================

  const handleDelete = async (sourceId) => {
    try {
      await deleteSource(sourceId);

      const updatedSources =
        sourceList.filter(
          (source) =>
            (source._id || source.id) !==
            sourceId
        );

      setSourceList(updatedSources);

      // Notify App.jsx
      if (onSourcesChange) {
        onSourcesChange(updatedSources);
      }

    } catch (error) {
      console.error(
        "Failed to delete source:",
        error
      );
    }
  };

  const loadSources = async () => {
  try {
    const res = await getSources(notebookId);

    const fetchedSources =
      res.data ?? [];

    setSourceList(fetchedSources);

    if (onSourcesChange) {
      onSourcesChange(fetchedSources);
    }

    return fetchedSources;
  } catch (error) {
    console.error(
      "Failed to load sources:",
      error
    );

    return [];
  }
};


  // ==========================================
  // LOAD SOURCES
  // ==========================================

  // ==========================================
// LOAD + POLL SOURCES
// ==========================================

useEffect(() => {
  if (!notebookId) return;

  let cancelled = false;

  const processingStatuses = new Set([
    "uploading",
    "extracting",
    "chunking",
    "embedding",
    "storing",
  ]);

  

  let intervalId;

  const startPolling = async () => {
    const initialSources = await loadSources();

    if (cancelled) return;

    const hasProcessing = initialSources.some(
      (source) =>
        processingStatuses.has(source.status)
    );

    if (!hasProcessing) return;

    intervalId = setInterval(async () => {
      const latestSources = await loadSources();

      if (cancelled) return;

      const stillProcessing = latestSources.some(
        (source) =>
          processingStatuses.has(source.status)
      );

      if (!stillProcessing) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }, 1000);
  };

  startPolling();

  return () => {
    cancelled = true;

    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [notebookId]);


  // ==========================================
  // SYNC PROP → LOCAL STATE
  // ==========================================

  useEffect(() => {
    setSourceList(sources ?? []);

  }, [sources]);


  const readyCount =
    sourceList.filter(
      (source) =>
        source.status === "ready"
    ).length;


  return (
    <div className="relative h-full">

      <div className="mx-auto h-full max-w-4xl px-6 py-6">

        {/* HEADER */}

        <div className="mb-5 flex items-end justify-between">

          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Sources
            </h2>

            <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
              {sourceList.length} sources ·{" "}
              {readyCount} ready
            </p>
          </div>


          {/* FILTERS */}

          <div className="flex items-center gap-2">
            <FilterChip
              label="All"
              active
            />

            <FilterChip
              label="Ready"
            />

            <FilterChip
              label="Processing"
            />
          </div>

        </div>


        {/* SOURCE LIST */}

        {sourceList.length === 0 ? (

          <div className="flex min-h-75 flex-col items-center justify-center text-center">

            <h3 className="text-base font-medium">
              No sources yet
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a source to start building
              your knowledge base.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {sourceList.map(
              (source, index) => (

                <motion.div
                  key={
                    source._id ||
                    source.id
                  }

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

                    onDelete={
                      handleDelete
                    }
                  />

                </motion.div>

              )
            )}

          </div>

        )}

      </div>


      {/* ADD SOURCE BUTTON */}

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


      {/* SOURCE PICKER */}

      <AnimatePresence>

        {pickerOpen && (

          <SourcePicker
  notebookId={notebookId}
  setUploading={setUploading}
  onClose={() => setPickerOpen(false)}
  onPick={(updatedSources) => {
    setPickerOpen(false);

    setSourceList(updatedSources);

    if (onSourcesChange) {
      onSourcesChange(updatedSources);
    }

    setActiveTab("sources");
  }}
/>

        )}

      </AnimatePresence>

    </div>
  );
}


export default SourceView;