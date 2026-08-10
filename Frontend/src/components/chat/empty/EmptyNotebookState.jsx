import { Upload } from "lucide-react";

export default function EmptyNotebookState({
  onAddSource,
}) {
  return (
    <div className="flex max-w-md flex-col items-center text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Upload className="h-6 w-6" />
      </div>

      <h2 className="text-xl font-semibold">
        No sources yet
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Upload PDFs, DOCX files, websites or YouTube videos to start chatting with your notebook.
      </p>

      <button
        onClick={onAddSource}
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Add Source
      </button>
    </div>
  );
}