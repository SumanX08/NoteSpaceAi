import { create } from "zustand";

export const useAppStore = create((set) => ({
  // Notebook
  activeNotebookId: null,

  // Navigation
  activeTab: "chat",

  // Right panel
  rightPanelOpen: true,
  panelMode: "sources",

  // Preview
  previewSource: null,
  hoveredCitation: null,

  

  // Actions
  setActiveNotebookId: (id) =>
    set({ activeNotebookId: id }),

  setActiveTab: (tab) =>
    set({ activeTab: tab }),

  setRightPanelOpen: (open) =>
    set({ rightPanelOpen: open }),

  toggleRightPanel: () =>
    set((state) => ({
      rightPanelOpen: !state.rightPanelOpen,
    })),

  setPanelMode: (mode) =>
    set({ panelMode: mode }),

  setPreviewSource: (source) =>
    set({ previewSource: source }),

  setHoveredCitation: (citation) =>
    set({ hoveredCitation: citation }),

  resetRightPanel: () =>
    set({
      panelMode: "sources",
      previewSource: null,
      hoveredCitation: null,
    }),
}));