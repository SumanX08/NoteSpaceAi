import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  Pin,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function NotebookRow({
  notebook,
  active,
  onSelect,
  onRename,
  onDelete,
  onPin,
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(notebook.title);

  useEffect(() => {
    setTitle(notebook.title);
  }, [notebook.title]);

  const handleSave = () => {
    const value = title.trim();

    if (!value) {
      setTitle(notebook.title);
      setEditing(false);
      return;
    }

    if (value !== notebook.title) {
      onRename(notebook.id, value);
    }

    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(notebook.title);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-2 py-2 transition-colors",
        active
          ? "bg-primary/10"
          : "hover:bg-muted/60"
      )}
    >
      {active && (
        <motion.span
          layoutId="active-notebook"
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-glow"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      <button
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {notebook.isPinned && (
          <Pin className="h-3 w-3 shrink-0 fill-current text-primary" />
        )}

        <span className="shrink-0 text-lg">
          {notebook.emoji}
        </span>

        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }

                if (e.key === "Escape") {
                  handleCancel();
                }
              }}
              className="
                w-full
                rounded-md
                bg-input
                px-1
                text-sm
                font-medium
                text-foreground
                outline-none
                ring-1
                ring-ring
              "
            />
          ) : (
            <>
              <p
                className={cn(
                  "truncate text-sm font-medium",
                  active
                    ? "text-foreground"
                    : "text-foreground/90"
                )}
              >
                {notebook.title}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {notebook.sourceCount ?? 0} sources
              </p>
            </>
          )}
        </div>
      </button>

      {editing ? (
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-success"
          >
            <Check className="h-4 w-4" />
          </button>

          <button
            onClick={handleCancel}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                rounded-md
                p-1
                text-muted-foreground
                opacity-0
                transition-opacity
                group-hover:opacity-100
                hover:bg-muted
                hover:text-foreground
              "
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="glass-strong border-border"
          >
            <DropdownMenuItem
              onClick={() => onPin(notebook.id)}
            >
              <Pin className="mr-2 h-4 w-4" />

              {notebook.isPinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setEditing(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <AlertDialogContent className="glass-strong border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete Workspace?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => onDelete(notebook.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}