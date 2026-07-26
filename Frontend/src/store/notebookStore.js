import { create } from "zustand";
import { notebooks } from "@/lib/data";

export const useNotebookStore = create((set) => ({

    notebooks,

    createNotebook: () => {},

    updateNotebook: () => {},

}));