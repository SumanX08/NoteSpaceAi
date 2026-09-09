import {
  FileText,
  Globe,
  Database,
  FileCode,
  Type,
} from "lucide-react";

export const sourceIcon = {
  pdf: FileText,
  website: Globe,
  youtube: Database,
  transcript: FileCode,
  text: Type,
};

export const sourceTypeLabel = {
  pdf: "PDF",
  website: "Website",
  youtube: "YouTube",
  transcript: "Transcript",
  text: "Plain Text",
};

export const sourceTypeColor = {
  pdf: "text-orange-300",
  website: "text-blue-300",
  youtube: "text-red-300",
  transcript: "text-emerald-300",
  text: "text-zinc-300",
};

export const statusMeta = {
  uploading: {
    label: "Uploading source...",
    dot: "bg-warning animate-soft-pulse",
    text: "text-warning",
    bg: "bg-warning/10",
    processing: true,
  },

  extracting: {
    label: "Extracting content...",
    dot: "bg-primary animate-soft-pulse",
    text: "text-primary",
    bg: "bg-primary/10",
    processing: true,
  },

  chunking: {
    label: "Creating chunks...",
    dot: "bg-primary animate-soft-pulse",
    text: "text-primary",
    bg: "bg-primary/10",
    processing: true,
  },

  embedding: {
    label: "Generating embeddings...",
    dot: "bg-primary animate-soft-pulse",
    text: "text-primary",
    bg: "bg-primary/10",
    processing: true,
  },

  storing: {
    label: "Saving to knowledge base...",
    dot: "bg-primary animate-soft-pulse",
    text: "text-primary",
    bg: "bg-primary/10",
    processing: true,
  },

  ready: {
    label: "Ready",
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/10",
    processing: false,
  },

  failed: {
    label: "Processing failed",
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/10",
    processing: false,
  },
};