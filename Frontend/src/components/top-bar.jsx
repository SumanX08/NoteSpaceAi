import {Search,Plus,Bell,ChevronDown,PanelRightClose,PanelRightOpen,} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"

export function TopBar({ title, emoji, onAddSource }) {
  const rightPanelOpen = useAppStore(
    (state) => state.rightPanelOpen
  );

  const toggleRightPanel = useAppStore(
    (state) => state.toggleRightPanel
  );

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-base">{emoji}</span>

        <h1 className="truncate text-[0.9375rem] font-semibold tracking-tight">
          {title}
        </h1>

        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="mx-2 hidden h-5 w-px bg-border md:block" />

      <button className="hidden h-8 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-[0.8125rem] text-muted-foreground transition-colors hover:border-border-strong hover:bg-muted md:flex">
        <Search className="h-3.5 w-3.5" />

        <span>Search in notebook...</span>

        <kbd className="ml-6 rounded bg-background/60 px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
          ⌘F
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          onClick={onAddSource}
          size="sm"
          className={cn(
            "h-8 gap-1.5 rounded-lg bg-primary px-3 text-[0.8125rem] font-medium text-primary-foreground",
            "shadow-glow transition-colors hover:bg-primary-hover"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Source
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRightPanel}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={rightPanelOpen ? "Hide panel" : "Show panel"}
        >
          {rightPanelOpen ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Avatar className="h-8 w-8 ring-1 ring-border">
          <AvatarFallback className="bg-linear-to-br from-zinc-600 to-zinc-800 text-[0.625rem] font-semibold text-white">
            AK
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}