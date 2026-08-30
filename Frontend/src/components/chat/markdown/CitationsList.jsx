import { FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CitationsList({
  citations = [],
  sources = [],
  selectedCitation,
  onCitationClick,
}) {
  if (!citations.length) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Select a citation from a response to view its details.
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
            (item) =>
              String(item._id || item.id) ===
              String(citation.sourceId)
          );

          const isSelected =
            selectedCitation?.index ===
              citation.index &&
            String(selectedCitation?.sourceId) ===
              String(citation.sourceId);

          return (
            <button
              key={`${citation.sourceId}-${citation.index}`}
              type="button"
              onClick={() => {
                if (!source) return;

                onCitationClick?.(
                  citation,
                  source
                );
              }}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                [{citation.index}]
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {source?.title || "Unknown source"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {citation.page
                        ? `Page ${citation.page}`
                        : `Chunk ${citation.chunkIndex + 1}`}
                    </p>
                  </div>

                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />

                  <span>
                    {source
                      ? "View source"
                      : "Source unavailable"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}