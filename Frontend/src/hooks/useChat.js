import { useCallback } from "react";

import api from "@/services/api";

import { useChatStore } from "@/store/chatStore";
import { useAppStore } from "@/store/appStore";


// ======================================================
// CHAT HOOK
// ======================================================

export function useChat({
  activeNotebookId,
}) {
  const {
    setActiveMessageCitations,
  } = useAppStore();


  // ====================================================
  // UPDATE A MESSAGE
  // ====================================================

  const updateMessage = useCallback(
    (
      notebookId,
      messageId,
      updates
    ) => {
      /*
       * Notebook state currently lives
       * inside App.
       *
       * We dispatch a custom event so
       * App can update its local data.
       *
       * This will be replaced later if
       * notebook data moves to a query store.
       */

      window.dispatchEvent(
        new CustomEvent(
          "notespace:update-message",
          {
            detail: {
              notebookId,
              messageId,
              updates,
            },
          }
        )
      );
    },
    []
  );


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage =
    useCallback(
      async (question) => {
        const chatStore =
          useChatStore.getState();

        if (
          chatStore.isStreaming
        ) {
          return;
        }

        if (
          !activeNotebookId ||
          !question?.trim()
        ) {
          return;
        }

        const userMessage = {
          id:
            crypto.randomUUID(),

          role: "user",

          content:
            question,
        };

        const assistantId =
          crypto.randomUUID();

        const assistantMessage = {
          id: assistantId,

          role: "assistant",

          content: "",

          citations: [],

          streaming: true,

          stage: "searching",
        };


        // ------------------------------------------------
        // ADD LOCAL MESSAGES
        // ------------------------------------------------

        window.dispatchEvent(
          new CustomEvent(
            "notespace:add-messages",
            {
              detail: {
                notebookId:
                  activeNotebookId,

                messages: [
                  userMessage,
                  assistantMessage,
                ],
              },
            }
          )
        );


        // ------------------------------------------------
        // STREAM STATE
        // ------------------------------------------------

        const controller =
          new AbortController();

        chatStore.setStreaming(
          true
        );

        chatStore.setStreamingMessageId(
          assistantId
        );

        chatStore.setAbortController(
          controller
        );


        let fullAnswer = "";
        let processedLength = 0;
        let buffer = "";


        try {
          console.log(
            "🔍 Searching sources..."
          );


          await api.post(
            "/chat",
            {
              notebookId:
                activeNotebookId,

              question,
            },
            {
              responseType:
                "text",

              signal:
                controller.signal,

              headers: {
                Accept:
                  "text/event-stream",
              },

              onDownloadProgress:
                (progressEvent) => {
                  const xhr =
                    progressEvent
                      .event?.target ||
                    progressEvent
                      .currentTarget ||
                    progressEvent
                      .event
                      ?.currentTarget;

                  const responseText =
                    xhr?.responseText;

                  if (
                    typeof responseText !==
                    "string"
                  ) {
                    return;
                  }

                  if (
                    responseText.length <=
                    processedLength
                  ) {
                    return;
                  }


                  // --------------------------------------
                  // GET NEW DATA
                  // --------------------------------------

                  const newData =
                    responseText.slice(
                      processedLength
                    );

                  processedLength =
                    responseText.length;

                  buffer += newData;


                  // --------------------------------------
                  // PARSE SSE EVENTS
                  // --------------------------------------

                  const events =
                    buffer.split(
                      "\n\n"
                    );

                  buffer =
                    events.pop() ||
                    "";


                  for (
                    const rawEvent of events
                  ) {
                    if (
                      !rawEvent.trim()
                    ) {
                      continue;
                    }


                    let eventName =
                      "message";

                    let data = "";


                    for (
                      const line of
                        rawEvent.split(
                          "\n"
                        )
                    ) {
                      if (
                        line.startsWith(
                          "event:"
                        )
                      ) {
                        eventName =
                          line
                            .slice(6)
                            .trim();
                      }

                      if (
                        line.startsWith(
                          "data:"
                        )
                      ) {
                        data +=
                          line
                            .slice(5)
                            .trim();
                      }
                    }


                    if (!data) {
                      continue;
                    }


                    let parsed;

                    try {
                      parsed =
                        JSON.parse(
                          data
                        );
                    } catch {
                      console.warn(
                        "Invalid SSE data:",
                        data
                      );

                      continue;
                    }


                    // --------------------------------
                    // RAG COMPLETE
                    // --------------------------------

                    if (
                      eventName ===
                      "rag_complete"
                    ) {
                      console.log(
                        "🔍 RAG complete:",
                        parsed.chunkCount
                      );

                      updateMessage(
                        activeNotebookId,
                        assistantId,
                        {
                          stage:
                            "generating",
                        }
                      );

                      continue;
                    }


                    // --------------------------------
                    // TOKEN
                    // --------------------------------

                    if (
                      eventName ===
                      "token"
                    ) {
                      const token =
                        parsed.content ||
                        "";

                      if (!token) {
                        continue;
                      }

                      fullAnswer +=
                        token;

                      updateMessage(
                        activeNotebookId,
                        assistantId,
                        {
                          content:
                            fullAnswer,

                          streaming:
                            true,

                          stage:
                            "generating",
                        }
                      );

                      continue;
                    }


                    // --------------------------------
                    // DONE
                    // --------------------------------

                    if (
                      eventName ===
                      "done"
                    ) {
                      const citations =
                        parsed.citations ||
                        [];

                      console.log(
                        "✅ Stream complete"
                      );

                      setActiveMessageCitations(
                        citations
                      );

                      updateMessage(
                        activeNotebookId,
                        assistantId,
                        {
                          content:
                            fullAnswer,

                          citations,

                          streaming:
                            false,

                          stage:
                            "complete",
                        }
                      );
                    }
                  }
                },
            }
          );
        } catch (error) {
          if (
            error?.name ===
              "CanceledError" ||
            error?.name ===
              "AbortError" ||
            error?.code ===
              "ERR_CANCELED"
          ) {
            console.log(
              "🛑 Generation stopped"
            );

            return;
          }

          console.error(
            "❌ Failed to stream answer:",
            error
          );

          updateMessage(
            activeNotebookId,
            assistantId,
            {
              content:
                "Sorry, something went wrong while generating the answer.",

              streaming:
                false,

              stage:
                "error",

              error: true,
            }
          );
        } finally {
          useChatStore
            .getState()
            .resetChatState();
        }
      },
      [
        activeNotebookId,
        setActiveMessageCitations,
        updateMessage,
      ]
    );


  return {
    sendMessage,
  };
}