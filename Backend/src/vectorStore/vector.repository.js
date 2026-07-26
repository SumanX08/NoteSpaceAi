import qdrantClient from "./qdrant.client.js";

const collection = process.env.QDRANT_COLLECTION;

class VectorRepository {
  async upsertChunks(chunks) {
    const points = chunks.map((chunk) => ({
      id: chunk.vectorId,
      vector: chunk.embedding,
      payload: {
        notebookId: chunk.notebook.toString(),
        sourceId: chunk.source.toString(),
        chunkIndex: chunk.chunkIndex,
        page: chunk.metadata?.page ?? null,
      },
    }));

    await qdrantClient.upsert(collection, {
      wait: true,
      points,
    });
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

    const result = await qdrantClient.query(collection, {
      query: queryVector,
      limit,
      filter,
      with_payload: true,
    });

    return result.points.map((point) => ({
  vectorId: point.id,
  score: point.score,
  notebookId: point.payload.notebookId,
  sourceId: point.payload.sourceId,
  chunkIndex: point.payload.chunkIndex,
  page: point.payload.page,
}));
  }

  async deleteBySource(sourceId) {
    await qdrantClient.delete(collection, {
      filter: {
        must: [
          {
            key: "sourceId",
            match: {
              value: sourceId.toString(),
            },
          },
        ],
      },
      wait: true,
    });
  }

  async deleteByNotebook(notebookId) {
    await qdrantClient.delete(collection, {
      filter: {
        must: [
          {
            key: "notebookId",
            match: {
              value: notebookId.toString(),
            },
          },
        ],
      },
      wait: true,
    });
  }
}

export default new VectorRepository();