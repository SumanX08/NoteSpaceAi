import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

export default function SidebarHeader({
  onCreateNotebook,
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>

        <span className="text-[15px] font-semibold tracking-tight">
          NoteSpace AI
        </span>

        <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          PRO
        </span>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <button className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted">
          <Search className="h-4 w-4" />
          <span>Search...</span>
        </button>
      </div>

      {/* New Notebook */}
      <div className="px-3 pb-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNotebook}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-soft"
        >
          <Plus className="h-4 w-4" />
          New Workspace
        </motion.button>
      </div>
    </>
  );
}