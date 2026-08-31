import qdrantClient from "./qdrant.client.js";

const collection = process.env.QDRANT_COLLECTION;

class VectorRepository {
  async upsertChunks(chunks = []) {

    console.log(
      "Qdrant chunks received:",
      chunks.length
    );

    if (!Array.isArray(chunks)) {
      throw new Error(
        "Qdrant upsert expects an array."
      );
    }

    if (chunks.length === 0) {
      console.log(
        "No vectors to upsert. Skipping Qdrant."
      );

      return;
    }

    const points = chunks
      .filter(
        (chunk) =>
          chunk.vectorId &&
          Array.isArray(chunk.embedding) &&
          chunk.embedding.length > 0
      )
      .map((chunk) => ({
        id: chunk.vectorId,

        vector: chunk.embedding,

       payload: {
  notebookId:
    chunk.notebook.toString(),

  sourceId:
    chunk.source.toString(),

  chunkIndex:
    chunk.chunkIndex,

  page:
    chunk.metadata?.page ?? null,

  start:
    chunk.metadata?.start ?? null,

  end:
    chunk.metadata?.end ?? null,

  startTime:
    chunk.metadata?.startTime ?? null,

  endTime:
    chunk.metadata?.endTime ?? null,
},
      }));

    console.log(
      "Qdrant points prepared:",
      points.length
    );

    if (points.length === 0) {
      throw new Error(
        "No valid Qdrant points available."
      );
    }

    console.log(
      "Embedding dimension:",
      points[0].vector.length
    );

    try {
      await qdrantClient.upsert(
        collection,
        {
          wait: true,
          points,
        }
      );

      console.log(
        "Qdrant upsert successful"
      );

    } catch (error) {

      console.error(
        "Qdrant upsert failed:",
        error?.data || error.message
      );

      throw error;
    }
  }

  async search(queryVector, options = {}) {
    const {
      limit = 5,
      notebookId,
      sourceId,
    } = options;

    let filter;

    if (notebookId || sourceId) {
      filter = {
        must: [],
      };

      if (notebookId) {
        filter.must.push({
          key: "notebookId",
          match: {
            value: notebookId.toString(),
          },
        });
      }

      if (sourceId) {
        filter.must.push({
          key: "sourceId",
          match: {
            value: sourceId.toString(),
          },
        });
      }
    }

    const result = await qdrantClient.query(
      collection,
      {
        query: queryVector,
        limit,
        filter,
        with_payload: true,
      }
    );

    return (result.points ?? []).map(
  (point) => ({
    vectorId: point.id,

    score: point.score,

    notebookId:
      point.payload?.notebookId,

    sourceId:
      point.payload?.sourceId,

    chunkIndex:
      point.payload?.chunkIndex,

    page:
      point.payload?.page,

    start:
      point.payload?.start,

    end:
      point.payload?.end,

    startTime:
      point.payload?.startTime,

    endTime:
      point.payload?.endTime,
  })
);
  }

  async deleteBySource(sourceId) {
    await qdrantClient.delete(
      collection,
      {
        filter: {
          must: [
            {
              key: "sourceId",
              match: {
                value:
                  sourceId.toString(),
              },
            },
          ],
        },
        wait: true,
      }
    );
  }

  async deleteByNotebook(notebookId) {
    await qdrantClient.delete(
      collection,
      {
        filter: {
          must: [
            {
              key: "notebookId",
              match: {
                value:
                  notebookId.toString(),
              },
            },
          ],
        },
        wait: true,
      }
    );
  }
}

export default new VectorRepository();