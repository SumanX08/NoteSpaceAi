import { create } from "zustand";

export const useChatStore = create((set) => ({
  input: "",

  isStreaming: false,

  streamingMessageId: null,

  abortController: null,

 
  


  setInput: (input) =>
    set({ input }),

  setStreaming: (streaming) =>
    set({ isStreaming: streaming }),

  setStreamingMessageId: (id) =>
    set({ streamingMessageId: id }),

  setAbortController: (controller) =>
    set({ abortController: controller }),

  resetChatState: () =>
    set({
      input: "",
      isStreaming: false,
      streamingMessageId: null,
      abortController: null,
    }),
}));