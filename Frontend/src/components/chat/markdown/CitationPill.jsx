import { cn } from "@/lib/utils";

export default function CitationPill({
  citation,
  onClick,
  onHover,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onClick?.(citation)
      }
      onMouseEnter={() =>
        onHover?.(citation)
      }
      onMouseLeave={() =>
        onHover?.(null)
      }
      className={cn(
        "mx-0.5 inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20"
      )}
    >
      [{citation.index}]
    </button>
  );
}