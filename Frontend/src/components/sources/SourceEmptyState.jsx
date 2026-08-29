import {
  FileQuestion,
} from "lucide-react";

export default function SourceEmptyState() {
  return (
    <div
      className="
        mt-8
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-border
        text-center
      "
    >

      <div
        className="
          mb-4
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-muted
        "
      >
        <FileQuestion className="h-6 w-6 text-muted-foreground" />
      </div>


      <h3 className="font-medium">
        No sources yet
      </h3>


      <p
        className="
          mt-1
          max-w-sm
          text-sm
          text-muted-foreground
        "
      >
        Add a source to start building
        your notebook knowledge base.
      </p>

    </div>
  );
}