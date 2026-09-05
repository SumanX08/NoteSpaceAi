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
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
    progress: 10,
  },

  extracting: {
    label: "Extracting",
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    dot: "bg-yellow-400",
    progress: 30,
  },

  chunking: {
    label: "Chunking",
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    dot: "bg-orange-400",
    progress: 50,
  },

  embedding: {
    label: "Embedding",
    text: "text-purple-400",
    bg: "bg-purple-400/10",
    dot: "bg-purple-400",
    progress: 70,
  },

  storing: {
    label: "Storing",
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    dot: "bg-cyan-400",
    progress: 90,
  },

  ready: {
    label: "Ready",
    text: "text-green-400",
    bg: "bg-green-400/10",
    dot: "bg-green-400",
    progress: 100,
  },

  failed: {
    label: "Failed",
    text: "text-red-400",
    bg: "bg-red-400/10",
    dot: "bg-red-400",
    progress: 0,
  },
};