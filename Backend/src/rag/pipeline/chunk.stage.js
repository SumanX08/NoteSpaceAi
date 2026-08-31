import chunkText from "../chunking/recursive.chunker.js";

export default async function chunkStage(context) {
  console.log("CHUNK STAGE START");

  const extracted = context.extracted;

  if (!extracted) {
    throw new Error(
      "No extracted content available for chunking."
    );
  }

  // =====================================
  // PAGE-AWARE SOURCES (PDF)
  // =====================================

  if (
    Array.isArray(extracted.pages) &&
    extracted.pages.length > 0
  ) {
    const allChunks = [];

    let chunkIndex = 0;

    for (const pageData of extracted.pages) {
      const pageText =
        pageData.text?.trim();

      if (!pageText) continue;

      const pageChunks =
        await chunkText(pageText);

      for (const chunk of pageChunks) {
        allChunks.push({
          ...chunk,

          chunkIndex,

          metadata: {
            ...chunk.metadata,

            page: pageData.page,
          },
        });

        chunkIndex++;
      }
    }

    context.chunks = allChunks;

  }

  // =====================================
  // TIME-AWARE SOURCES (YOUTUBE)
  // =====================================

  else if (
    Array.isArray(extracted.segments) &&
    extracted.segments.length > 0
  ) {
    const allChunks = [];

    const chunkSize = 1200;
    let currentText = "";
    let startTime = null;
    let endTime = null;

    for (const segment of extracted.segments) {
      const segmentText =
        segment.text?.trim();

      if (!segmentText) continue;

      if (startTime === null) {
        startTime =
          segment.startTime;
      }

      currentText +=
        `${segmentText} `;

      endTime =
        segment.endTime;

      if (
        currentText.length >=
        chunkSize
      ) {
        allChunks.push({
          chunkIndex:
            allChunks.length,

          text:
            currentText.trim(),

          metadata: {
            startTime,
            endTime,
          },
        });

        currentText = "";
        startTime = null;
        endTime = null;
      }
    }

    // Remaining transcript
    if (currentText.trim()) {
      allChunks.push({
        chunkIndex:
          allChunks.length,

        text:
          currentText.trim(),

        metadata: {
          startTime,
          endTime,
        },
      });
    }

    context.chunks = allChunks;

  }

  // =====================================
  // NORMAL TEXT SOURCES
  // =====================================

  else {
    if (!extracted.text) {
      throw new Error(
        "No extracted text available for chunking."
      );
    }

    context.chunks =
      await chunkText(
        extracted.text
      );
  }

  console.log(
    "CHUNK STAGE - chunks created:",
    context.chunks.length
  );

  if (!context.chunks.length) {
    throw new Error(
      "Chunking produced zero chunks."
    );
  }

  context.stats.chunkCount =
    context.chunks.length;

  return context;
}