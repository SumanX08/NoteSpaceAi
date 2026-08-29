import { useState,useRef }from 'react'
import { motion } from "framer-motion";


import { uploadSource, getSources } from "@/services/source.service";

import {
  
  X,
  FileText,
  Globe,
  
  FileCode,
  Type,
  Upload,
  Database,
  

} from "lucide-react";

const addOptions = [
  {
    type: "pdf",
    label: "PDF",
    icon: FileText,
    desc: "Upload a document",
  },
  {
    type: "website",
    label: "Website",
    icon: Globe,
    desc: "Crawl a URL",
  },
  {
    type: "youtube",
    label: "YouTube",
    icon: Database,
    desc: "Paste a video link",
  },
  {
    type: "transcript",
    label: "Transcript",
    icon: FileCode,
    desc: "Add a transcript",
  },
  {
    type: "text",
    label: "Plain Text",
    icon: Type,
    desc: "Paste raw text",
  },
];


function SourcePicker({  notebookId,
  setUploading,
  setSourceList,
  onClose,
  onPick,
}) {
const inputRef = useRef(null);
const [selectedType, setSelectedType] = useState(null);
const [url, setUrl] = useState("");
const [text, setText] = useState("");

const handleFile = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
formData.append("notebookId", notebookId);
formData.append("type", selectedType);

    try {
        setUploading(true);

        await uploadSource(formData);

        const res = await getSources(notebookId);

        setSourceList(res.data);

        onClose();
    } catch (err) {
        console.error(err);
    } finally {
        setUploading(false);
    }
};
const handleWebsite = async () => {
  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("notebookId", notebookId);
    formData.append("type", "website");
    formData.append("url", url);
    console.log(url)

    await uploadSource(formData);

    const res = await getSources(notebookId);
    setSourceList(res.data);

    onClose();
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};
const handleYoutube = async () => {
  if (!url.trim()) return;

  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("notebookId", notebookId);
    formData.append("type", "youtube");
    formData.append("url", url.trim());

    await uploadSource(formData);

    const res = await getSources(notebookId);

    setSourceList(res.data);

    onClose();
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
  }
};

{
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      onClick={onClose}
      className="absolute inset-0 z-30 flex items-center justify-center bg-background/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 8,
        }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="w-full max-w-md rounded-2xl border border-border bg-popover p-5 shadow-elevated"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFile}
        />

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[0.9375rem] font-semibold">
            Add a source
          </h3>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {addOptions.map(
            (option) => {
              const Icon =
                option.icon;

              return (
                <button
                  key={
                    option.type
                  }
                  onClick={() => {
  setSelectedType(option.type);

  if (["pdf", "docx", "transcript"].includes(option.type)) {
    inputRef.current.click();
  }
}}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 text-left transition-all hover:border-primary/40 hover:bg-card"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[0.8125rem] font-medium">
                      {option.label}
                    </p>

                    <p className="text-[0.6875rem] text-muted-foreground">
                      {option.desc}
                    </p>
                  </div>

                  <Upload className="h-3.5 w-3.5 text-muted-foreground-dim opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            }
          )}

          {selectedType === "website" && (
  <div className="mt-4 space-y-2">
    <input
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://..."
      className="w-full rounded-lg border p-2"
    />

    <button
      onClick={handleWebsite}
      className="w-full rounded-lg bg-primary p-2 text-primary-foreground"
    >
      Add Website
    </button>
  </div>
)}
{selectedType === "youtube" && (
  <div className="mt-4 space-y-2">
    <input
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://www.youtube.com/watch?v=..."
      className="w-full rounded-lg border p-2"
    />

    <button
      onClick={handleYoutube}
      disabled={!url.trim() }
      className="w-full rounded-lg bg-primary p-2 text-primary-foreground disabled:opacity-50"
    >
    </button>
  </div>
)}

        </div>
      </motion.div>
    </motion.div>
  )}
}

export default SourcePicker