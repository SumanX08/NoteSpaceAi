import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";

export default function SidebarHeader({
  onCreateNotebook,
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <img
          src="/logo.png"
          alt="NoteSpace AI"
          className="h-8 w-8 rounded-lg object-contain"
        />

        <span className="text-lg font-semibold tracking-tight text-foreground">
          NoteSpace
          <span className="text-primary-hover"> AI</span>
        </span>

       
      </div>

      {/* Search */}
      <div className="px-3 pb-2 pt-3">
        <button
          className="
            flex
            h-9
            w-full
            items-center
            gap-2
            rounded-lg
            border
            border-border
            bg-muted/40
            px-3
            text-sm
            text-muted-foreground
            transition-colors
            hover:bg-muted
            hover:text-foreground
          "
        >
          <Search className="h-4 w-4" />

          <span>Search...</span>
        </button>
      </div>

      {/* New Workspace */}
      <div className="px-3 pb-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNotebook}
          className="
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-primary
            text-sm
            font-medium
            text-primary-foreground
            shadow-soft
            transition-colors
            hover:bg-primary-hover
          "
        >
          <Plus className="h-4 w-4" />
          New Workspace
        </motion.button>
      </div>
    </>
  );
}