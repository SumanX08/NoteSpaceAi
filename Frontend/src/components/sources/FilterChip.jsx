
import { cn } from "@/lib/utils";

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

export default FilterChip