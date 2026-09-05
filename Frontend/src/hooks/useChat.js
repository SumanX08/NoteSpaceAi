import { useCallback } from "react";

import api from "@/services/api";

import { useChatStore } from "@/store/chatStore";
import { useAppStore } from "@/store/appStore";


// ======================================================
// CHAT HOOK
// ======================================================

export function useChat({
  activeNotebookId,
  setNotebooks,
}) {
  const setActiveMessageCitations =
    useAppStore(
      (state) =>
        state.setActiveMessageCitations
    );


  // ====================================================
  // UPDATE MESSAGE
  // ====================================================

  const updateMessage = useCallback(
    (
      notebookId,
      messageId,
      updates
    ) => {
      setNotebooks((prev) =>
        prev.map((notebook) =>
          notebook.id === notebookId
            ? {
                ...notebook,

                messages:
                  (
                    notebook.messages ??
                    []
                  ).map((message) =>
                    message.id ===
                    messageId
                      ? {
                          ...message,
                          ...updates,
                        }
                      : message
                  ),
              }
            : notebook
        )
      );
    },
    [setNotebooks]
  );


  // ====================================================
  // ADD MESSAGES
  // ====================================================

  const addMessages = useCallback(
    (
      notebookId,
      messages
    ) => {
      setNotebooks((prev) =>
        prev.map((notebook) =>
          notebook.id === notebookId
            ? {
                ...notebook,

                messages: [
                  ...(notebook.messages ??
                    []),

                  ...messages,
                ],
              }
            : notebook
        )
      );
    },
    [setNotebooks]
  );


  // ====================================================
  // PARSE SSE EVENT
  // ====================================================

  const processSSEEvent = useCallback(
    ({
      rawEvent,
      notebookId,
      assistantId,
      getFullAnswer,
      appendAnswer,
    }) => {
      if (!rawEvent?.trim()) {
        return;
      }

      let eventName =
        "message";

      const dataLines = [];


      // ----------------------------------------------
      // READ SSE LINES
      // ----------------------------------------------

      for (
        const line of rawEvent.split(
          /\r?\n/
        )
      ) {
        if (
          line.startsWith("event:")
        ) {
          eventName =
            line
              .slice(6)
              .trim();

          continue;
        }

        if (
          line.startsWith("data:")
        ) {
          dataLines.push(
            line
              .slice(5)
              .trim()
          );
        }
      }


      if (!dataLines.length) {
        return;
      }


      const rawData =
        dataLines.join("\n");


      // ----------------------------------------------
      // PARSE JSON
      // ----------------------------------------------

      let data;

      try {
        data =
          JSON.parse(rawData);
      } catch (error) {
        console.warn(
          "⚠️ Invalid SSE data:",
          rawData
        );

        return;
      }


      // =================================================
      // RAG COMPLETE
      // =================================================

      if (
        eventName ===
        "rag_complete"
      ) {
        console.log(
          "🔍 RAG complete:",
          data.chunkCount
        );

        updateMessage(
          notebookId,
          assistantId,
          {
            stage:
              "generating",
          }
        );

        return;
      }


      // =================================================
      // TOKEN
      // =================================================

      if (
        eventName ===
        "token"
      ) {
        const token =
          data.content || "";

        if (!token) {
          return;
        }

        appendAnswer(token);

        const answer =
          getFullAnswer();

        console.log(
          "📝 Token received:",
          token
        );

        updateMessage(
          notebookId,
          assistantId,
          {
            content: answer,

            streaming:
              true,

            stage:
              "generating",
          }
        );

        return;
      }


      // =================================================
      // DONE
      // =================================================

      if (
        eventName ===
        "done"
      ) {
        const citations =
          data.citations ??
          [];

        console.log(
          "✅ Stream complete"
        );

        setActiveMessageCitations(
          citations
        );

        updateMessage(
          notebookId,
          assistantId,
          {
            content:
              getFullAnswer(),

            citations,

            streaming:
              false,

            stage:
              "complete",
          }
        );
      }
    },
    [
      updateMessage,
      setActiveMessageCitations,
    ]
  );


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage =
    useCallback(
      async (question) => {
        const chatStore =
          useChatStore.getState();


        // ----------------------------------------------
        // PREVENT DUPLICATE REQUESTS
        // ----------------------------------------------

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


        const notebookId =
          activeNotebookId;


        // ----------------------------------------------
        // USER MESSAGE
        // ----------------------------------------------

        const userMessage = {
          id:
            crypto.randomUUID(),

          role:
            "user",

          content:
            question.trim(),
        };


        // ----------------------------------------------
        // ASSISTANT PLACEHOLDER
        // ----------------------------------------------

        const assistantId =
          crypto.randomUUID();

        const assistantMessage = {
          id:
            assistantId,

          role:
            "assistant",

          content:
            "",

          citations:
            [],

          streaming:
            true,

          stage:
            "searching",
        };


        // ----------------------------------------------
        // SHOW MESSAGES IMMEDIATELY
        // ----------------------------------------------

        addMessages(
          notebookId,
          [
            userMessage,
            assistantMessage,
          ]
        );


        // ----------------------------------------------
        // ABORT CONTROLLER
        // ----------------------------------------------

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


        // ----------------------------------------------
        // STREAM STATE
        // ----------------------------------------------

        let fullAnswer = "";

        let processedLength = 0;

        let buffer = "";


        const getFullAnswer =
          () => fullAnswer;


        const appendAnswer =
          (token) => {
            fullAnswer += token;
          };


        // =================================================
        // PROCESS RESPONSE TEXT
        // =================================================

        const processResponseText =
          (responseText) => {
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


            const newData =
              responseText.slice(
                processedLength
              );


            processedLength =
              responseText.length;


            buffer += newData;


            // --------------------------------------------
            // SSE EVENTS ARE SEPARATED BY BLANK LINE
            // --------------------------------------------

            const events =
              buffer.split(
                /\r?\n\r?\n/
              );


            // Last item may be incomplete
            buffer =
              events.pop() ?? "";


            for (
              const rawEvent of events
            ) {
              processSSEEvent({
                rawEvent,

                notebookId,

                assistantId,

                getFullAnswer,

                appendAnswer,
              });
            }
          };


        // =================================================
        // REQUEST
        // =================================================

        try {
          console.log(
            "🚀 Sending chat request..."
          );


          await api.post(
            "/chat",
            {
              notebookId,

              question:
                question.trim(),
            },
            {
              responseType:
                "text",

              signal:
                controller.signal,

              headers: {
                Accept:
                  "text/event-stream",

                "Cache-Control":
                  "no-cache",
              },


              // IMPORTANT:
              // Force Axios to use XHR so
              // responseText is available.

              adapter:
                "xhr",


              // ------------------------------------------
              // STREAM DATA
              // ------------------------------------------

              onDownloadProgress:
                (progressEvent) => {
                  console.log(
                    "📡 Download progress:",
                    progressEvent.loaded
                  );


                  const xhr =
                    progressEvent
                      ?.event
                      ?.target;


                  if (!xhr) {
                    console.warn(
                      "⚠️ XHR not available"
                    );

                    return;
                  }


                  const responseText =
                    xhr.responseText;


                  if (
                    typeof responseText !==
                    "string"
                  ) {
                    console.warn(
                      "⚠️ responseText unavailable"
                    );

                    return;
                  }


                  console.log(
                    "📦 Received:",
                    responseText.length,
                    "characters"
                  );


                  processResponseText(
                    responseText
                  );
                },
            }
          );


          // =================================================
          // PROCESS REMAINING BUFFER
          // =================================================

          if (buffer.trim()) {
            console.log(
              "📦 Processing final SSE buffer"
            );


            processSSEEvent({
              rawEvent:
                buffer,

              notebookId,

              assistantId,

              getFullAnswer,

              appendAnswer,
            });

            buffer = "";
          }


          // =================================================
          // SAFETY FALLBACK
          // =================================================

          /*
           * If the server completed but for some reason
           * the "done" event wasn't processed, make sure
           * the assistant placeholder doesn't stay stuck
           * forever.
           */

          if (fullAnswer) {
            updateMessage(
              notebookId,
              assistantId,
              {
                content:
                  fullAnswer,

                streaming:
                  false,

                stage:
                  "complete",
              }
            );
          }

        } catch (error) {
          // ----------------------------------------------
          // REQUEST CANCELLED
          // ----------------------------------------------

          const cancelled =
            error?.name ===
              "CanceledError" ||
            error?.name ===
              "AbortError" ||
            error?.code ===
              "ERR_CANCELED";


          if (cancelled) {
            console.log(
              "🛑 Generation stopped"
            );


            updateMessage(
              notebookId,
              assistantId,
              {
                streaming:
                  false,

                stage:
                  "stopped",
              }
            );


            return;
          }


          // ----------------------------------------------
          // ERROR
          // ----------------------------------------------

          console.error(
            "❌ Failed to stream answer:",
            error
          );


          updateMessage(
            notebookId,
            assistantId,
            {
              content:
                "Sorry, something went wrong while generating the answer.",

              streaming:
                false,

              stage:
                "error",

              error:
                true,
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
        addMessages,
        updateMessage,
        processSSEEvent,
      ]
    );


  return {
    sendMessage,
  };
}