import chunkText from "../chunking/recursive.chunker.js";

export default async function chunkStage(context) {
  console.log(
    "CHUNK STAGE START"
  );

  const extracted =
    context.extracted;

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
    console.log(
      "Page-aware chunking:",
      extracted.pages.length,
      "pages"
    );

    const allChunks = [];

    let chunkIndex = 0;

    for (const pageData of extracted.pages) {
      const pageText =
        pageData.text?.trim();

      if (!pageText) {
        continue;
      }

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

    context.chunks =
      allChunks;

  } else {

    // =====================================
    // NORMAL TEXT SOURCES
    // =====================================

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