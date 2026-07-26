import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { sourceIcon } from "@/lib/source-meta";
import { useAppStore } from "@/store/appStore";

export function CitationPill({
  label,
  sourceId,
  detail,
  onHover,
  so
}) {
  const { currentSources=[] } = useAppStore();

  const source = currentSources.find(
    (s) => s.id === sourceId
  );

  const Icon = source
    ? sourceIcon[source.type]
    : null;

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="citation"
            onMouseEnter={() =>
              onHover?.({
                id: sourceId,
                label,
                sourceId,
                detail,
              })
            }
            onMouseLeave={() => onHover?.(null)}
          >
            {Icon && (
              <Icon className="h-2.5 w-2.5" />
            )}

            {label}
          </span>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className="max-w-60 border border-border bg-popover text-popover-foreground shadow-elevated"
        >
          <div className="space-y-1">
            <p className="font-medium">
              {source?.title ?? "Source"}
            </p>

            <p className="text-[0.7rem] text-muted-foreground">
              {detail}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}