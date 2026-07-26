import { FileText, Globe, Database, FileCode, Type } from 'lucide-react';
export const sourceIcon = {
  pdf: FileText,
  website: Globe,
  youtube: Database,
  transcript: FileCode,
  text: Type,
};
export const sourceTypeLabel = {
  pdf: 'PDF',
  website: 'Website',
  youtube: 'Youtuube',
  transcript: 'Transcript',
  text: 'Plain Text',
};
export const sourceTypeColor = {
  pdf: 'text-orange-300',
  website: 'text-blue-300',
  youtube: 'text-red-300',
  transcript: 'text-emerald-300',
  text: 'text-zinc-300',
};
export const statusMeta = {
  ready: {
    label: 'Ready',
    dot: 'bg-success',
    text: 'text-success',
    bg: 'bg-success/10',
  },
  indexing: {
    label: 'Indexing',
    dot: 'bg-primary animate-soft-pulse',
    text: 'text-primary',
    bg: 'bg-primary/10',
  },
  uploading: {
    label: 'Uploading',
    dot: 'bg-warning animate-soft-pulse',
    text: 'text-warning',
    bg: 'bg-warning/10',
  },
  failed: {
    label: 'Failed',
    dot: 'bg-destructive',
    text: 'text-destructive',
    bg: 'bg-destructive/10',
  },
};
