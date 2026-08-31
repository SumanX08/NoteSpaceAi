import { useState } from "react";
import {
  FileText,
  Hash,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { openCitationSource } from "@/lib/openCitationSource";

export default function CitationsList({
  citations = [],
  sources = [],
  selectedCitation,
  onCitationClick,
}) {
  const [expanded, setExpanded] = useState(null);

  if (!citations.length) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        No citations available for this response.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">
          Citations
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Sources used in this response
        </p>
      </div>

      <div className="space-y-3">
        {citations.map((citation) => {
          const source = sources.find(
            (source) =>
              String(source._id || source.id) ===
              String(citation.sourceId)
          );

          const isSelected =
            selectedCitation?.index === citation.index;

          const isExpanded =
            expanded === citation.index;

          const fullText =
            citation.text || "";

          const previewText =
            fullText.length > 350
              ? `${fullText.slice(0, 350)}...`
              : fullText;

          return (
            <div
              key={`${citation.sourceId}-${citation.index}`}
              className={`rounded-xl border p-4 transition ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-sm font-semibold text-primary">
                    [{citation.index}]
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />

                    <p className="truncate text-sm font-medium">
                      {source?.title || "Unknown source"}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {citation.page && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Page {citation.page}
                      </span>
                    )}

                    {citation.chunkIndex !== null &&
                      citation.chunkIndex !== undefined && (
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          Chunk {citation.chunkIndex + 1}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Relevant excerpt */}
              {fullText && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs leading-5 text-muted-foreground">
                    {isExpanded
                      ? fullText
                      : previewText}
                  </p>

                  {fullText.length > 350 && (
                    <button
                      onClick={() =>
                        setExpanded(
                          isExpanded
                            ? null
                            : citation.index
                        )
                      }
                      className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          Show less
                          <ChevronUp className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Show more
                          <ChevronDown className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* View source */}
              <button
  onClick={() => {
    if (!source) return;

    openCitationSource(
      source,
      citation
    );
  }}
  disabled={!source}
  className="mt-4 flex items-center gap-2 text-xs font-medium text-primary transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
>
                <ExternalLink className="h-3.5 w-3.5" />

                View source
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}