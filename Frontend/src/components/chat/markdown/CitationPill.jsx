import { cn } from "@/lib/utils";

export default function CitationPill({
  citation,
  onHover,
  onClick,
}) {
  return (
    <button
      type="button"
      onMouseEnter={() =>
        onHover?.(citation)
      }
      onMouseLeave={() =>
        onHover?.(null)
      }
      onClick={() =>
        onClick?.(citation)
      }
      className={cn(
        "mx-0.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20"
      )}
      title={
        citation.page
          ? `Source ${citation.index} • Page ${citation.page}`
          : `Source ${citation.index}`
      }
    >
      [{citation.index}]
    </button>
  );
}