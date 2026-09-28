import { Plus, BookOpen } from "lucide-react";

export default function EmptyNotebook({
  onCreateNotebook,
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Empty chat content */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="flex max-w-md flex-col items-center px-6 text-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Create a workspace to get started
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create a workspace, add your sources, and
            start chatting with your knowledge.
          </p>

          <button
            onClick={onCreateNotebook}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-primary
              px-4
              py-2.5
              text-sm
              font-medium
              text-primary-foreground
              transition-colors
              hover:bg-primary-hover
            "
          >
            <Plus className="h-4 w-4" />
            Create Workspace
          </button>
        </div>
      </div>

      {/* Disabled chat input */}
      <div className="mx-auto w-full max-w-4xl px-6 pb-5">
        <div className="rounded-xl border border-border bg-background px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Create a workspace to start chatting...
          </p>
        </div>

        <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">
          Add sources to your workspace and ask questions about them.
        </p>
      </div>
    </div>
  );
}