import { create } from "zustand";

export const useAppStore = create((set) => ({
  // Notebook
  activeNotebookId: null,

  // Navigation
  activeTab: "chat",

  // Right panel
  rightPanelOpen: true,
  panelMode: "sources",

  activeMessageCitations: [],
  selectedCitation: null,

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

  setActiveMessageCitations: (citations) =>
  set({
    activeMessageCitations: citations,
  }),

setSelectedCitation: (citation) =>
  set({
    selectedCitation: citation,
    panelMode: "citations",
    rightPanelOpen: true,
  }),


  setPreviewSource: (source) =>
    set({ previewSource: source }),

  setHoveredCitation: (citation) =>
    set({ hoveredCitation: citation }),

  resetRightPanel: () =>
  set({
    panelMode: "sources",
    activeMessageCitations: [],
    selectedCitation: null,
    previewSource: null,
    hoveredCitation: null,
  }),
}));