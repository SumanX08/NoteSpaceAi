import {
  motion,
} from "framer-motion";

import { cn } from "@/lib/utils";

export default function SegmentedGroup({
  options,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-border bg-muted/30 p-0.5">
      {options.map((option) => {
        const active =
          value === option.id;

        return (
          <button
            key={option.id}
            onClick={() =>
              onChange(
                option.id
              )
            }
            disabled={disabled}
            className={cn(
              "relative flex h-8 flex-1 items-center justify-center rounded-lg text-[0.8125rem] font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              disabled &&
                "cursor-not-allowed opacity-60"
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${options
                  .map(
                    (o) => o.id
                  )
                  .join("")}`}
                className="absolute inset-0 rounded-lg bg-background shadow-soft"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 32,
                }}
              />
            )}

            <span className="relative z-10">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}