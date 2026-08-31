import qdrantClient from "./qdrant.client.js";

export async function createCollection() {
  const collectionName = process.env.QDRANT_COLLECTION;

  const { collections } = await qdrantClient.getCollections();

  const exists = collections.some(
    (collection) => collection.name === collectionName
  );

  if (!exists) {
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 1536,
        distance: "Cosine",
      },
    });

    console.log(
      `Qdrant collection "${collectionName}" created`
    );
  } else {
    console.log(
      `Qdrant collection "${collectionName}" already exists`
    );
  }

  // Create payload indexes
  await qdrantClient.createPayloadIndex(
    collectionName,
    {
      field_name: "notebookId",
      field_schema: "keyword",
    }
  );

  await qdrantClient.createPayloadIndex(
    collectionName,
    {
      field_name: "sourceId",
      field_schema: "keyword",
    }
  );

  console.log("Qdrant payload indexes ready");
}