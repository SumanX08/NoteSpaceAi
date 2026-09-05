import {
  File,
  ExternalLink,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import { useAppStore } from "@/store/appStore";

import {
  sourceIcon,
  sourceTypeColor,
  sourceTypeLabel,
  statusMeta,
} from "./source.constants";


export default function SourceCard({
  source,
  onDelete,
}) {
  const {
    setPanelMode,
    setPreviewSource,
  } = useAppStore();


  const Icon =
    sourceIcon[source.type] || File;


    const stage = statusMeta[source.status];


  const meta =
    statusMeta[source.status];


 const processingStatuses = [
  "uploading",
  "extracting",
  "chunking",
  "embedding",
  "storing",
];

const processing =
  processingStatuses.includes(source.status);


  const handleDelete = () => {
    const confirmed =
      window.confirm(
        `Delete "${source.title}"?`
      );

    if (!confirmed) return;

    onDelete(source._id);
  };


  return (
    <div
      className="group rounded-2xl border border-border bg-card/40 p-4 transition-all hover:border-border-strong hover:bg-card/70"
    >

      {/* TOP */}

      <div className="flex items-start gap-3">

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60",
            sourceTypeColor[source.type]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>


        <div className="min-w-0 flex-1">

          <h3
            className="truncate text-[0.875rem] font-medium leading-snug"
          >
            {source.title}
          </h3>


          <div
            className="mt-1 flex items-center gap-2 text-[0.6875rem] text-muted-foreground"
          >

            <span>
              {sourceTypeLabel[source.type]}
            </span>

            <span>
              ·
            </span>

            <span>
              {source.createdAt
                ? new Date(
                    source.createdAt
                  ).toLocaleDateString()
                : "Recently added"}
            </span>

          </div>

        </div>


        {/* DELETE BUTTON */}

        <button
          onClick={handleDelete}
          title="Delete source"
          className="
            flex h-8 w-8
            items-center
            justify-center
            rounded-md
            text-muted-foreground
            transition-all
            hover:bg-destructive/10
            hover:text-destructive
          "
        >
          <Trash2 className="h-4 w-4" />
        </button>

      </div>


      {/* BOTTOM */}

      <div className="mt-3.5">

        {processing ? (

  <div className="space-y-1.5">

    <div
      className="
        flex
        items-center
        justify-between
        text-[0.6875rem]
      "
    >

      <span
        className={cn(
          "flex items-center gap-1.5 font-medium",
          meta?.text
        )}
      >

        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            meta?.dot
          )}
        />

        {stage?.label || "Processing"}

      </span>

      <span className="text-muted-foreground-dim">
        {stage?.progress || 0}%
      </span>

    </div>

    <Progress
      value={stage?.progress || 0}
      className="h-1"
    />

  </div>

) : (

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span
              className={cn(
                `
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2
                py-0.5
                text-[0.6875rem]
                font-medium
                `,
                meta.bg,
                meta.text
              )}
            >

              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  meta.dot
                )}
              />

              {meta.label}

            </span>


            <button
              onClick={() => {

                setPreviewSource(source);

                setPanelMode(
                  "preview"
                );

              }}
              className="
                flex
                items-center
                gap-1
                text-[0.6875rem]
                font-medium
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >

              Preview

              <ExternalLink
                className="h-3 w-3"
              />

            </button>

          </div>

        )}

      </div>

    </div>
  );
}