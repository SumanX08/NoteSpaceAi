import {
  FileText,
  File,
  Globe,
  

  Captions,
} from "lucide-react";


export const sourceIcon = {

  pdf: FileText,

  docx: FileText,

  text: FileText,

  website: Globe,

  youtube: File,

  transcript: Captions,

};


export const sourceTypeColor = {

  pdf: "text-red-500",

  docx: "text-blue-500",

  text: "text-slate-500",

  website: "text-green-500",

  youtube: "text-red-600",

  transcript: "text-purple-500",

};


export const sourceTypeLabel = {

  pdf: "PDF",

  docx: "Document",

  text: "Text",

  website: "Website",

  youtube: "YouTube",

  transcript: "Transcript",

};


export const statusMeta = {

  uploading: {
    label: "Uploading",
    text: "text-yellow-500",
    dot: "bg-yellow-500",
    bg: "bg-yellow-500/10",
  },

  processing: {
    label: "Indexing",
    text: "text-blue-500",
    dot: "bg-blue-500",
    bg: "bg-blue-500/10",
  },

  ready: {
    label: "Ready",
    text: "text-green-500",
    dot: "bg-green-500",
    bg: "bg-green-500/10",
  },

  failed: {
    label: "Failed",
    text: "text-red-500",
    dot: "bg-red-500",
    bg: "bg-red-500/10",
  },

};