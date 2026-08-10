import { Settings } from "lucide-react";

export default function SidebarFooter() {
  return (
    <div className="border-t border-border p-3">
      <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-white">
          AK
        </div>

        <div className="flex flex-1 flex-col items-start">
          <span className="text-sm font-medium">
            Alex Kim
          </span>

          <span className="text-xs text-muted-foreground">
            alex@lumen.io
          </span>
        </div>

        <Settings className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}