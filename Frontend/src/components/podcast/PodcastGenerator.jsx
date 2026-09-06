import {
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

import FieldLabel from "./FieldLabel";
import SegmentedGroup from "./SegmentedGroup";

import {
  styleMeta,
  voiceMeta,
  durationMeta,
} from "./podcast.constants";

export default function PodcastGenerator({
  onGenerate,
  submitting,
  hasGenerating,
  error,
}) {
  const [voice, setVoice] =
    useState("female");

  const [style, setStyle] =
    useState("teacher");

  const [duration, setDuration] =
    useState("10");

  const disabled =
    submitting ||
    hasGenerating;

  const handleGenerate =
    async () => {
      await onGenerate({
        style,
        voice,
        duration,
      });
    };

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <FieldLabel>
        Podcast style
      </FieldLabel>

      <div className="grid grid-cols-2 gap-2">
        {styleMeta.map((item) => {
          const Icon = item.icon;

          const active =
            style === item.id;

          return (
            <button
              key={item.id}
              onClick={() =>
                setStyle(
                  item.id
                )
              }
              disabled={disabled}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",

                active
                  ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20"
                  : "border-border bg-muted/20 hover:border-border-strong hover:bg-muted/40",

                disabled &&
                  "cursor-not-allowed opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[0.8125rem] font-medium",
                    active &&
                      "text-foreground"
                  )}
                >
                  {item.label}
                </p>

                <p className="text-[0.6875rem] text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel>
            Voice
          </FieldLabel>

          <SegmentedGroup
            options={voiceMeta}
            value={voice}
            onChange={setVoice}
            disabled={disabled}
          />
        </div>

        <div>
          <FieldLabel>
            Duration
          </FieldLabel>

          <SegmentedGroup
            options={durationMeta}
            value={duration}
            onChange={setDuration}
            disabled={disabled}
          />
        </div>
      </div>

      <motion.button
        whileHover={{
          scale: disabled ? 1 : 1.01,
        }}
        whileTap={{
          scale: disabled ? 1 : 0.99,
        }}
        onClick={handleGenerate}
        disabled={disabled}
        className={cn(
          "mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-glow transition-colors hover:bg-primary-hover",

          disabled &&
            "cursor-not-allowed opacity-70"
        )}
      >
        <Sparkles
          className={cn(
            "h-4 w-4",
            submitting &&
              "animate-spin"
          )}
        />

        {submitting
          ? "Starting Podcast…"
          : hasGenerating
          ? "Podcast Generating…"
          : "Generate Podcast"}
      </motion.button>

      {error && (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[0.75rem] text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}