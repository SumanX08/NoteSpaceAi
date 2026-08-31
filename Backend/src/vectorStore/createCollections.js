import qdrantClient from './qdrant.client.js'
export async function createCollection() {
  const collectionName = process.env.QDRANT_COLLECTION;

  const { collections } =
    await qdrantClient.getCollections();

  const exists = collections.some(
    (collection) =>
      collection.name === collectionName
  );

  if (exists) {
    console.log(
      `Qdrant collection "${collectionName}" already exists`
    );
    return;
  }

  await qdrantClient.createCollection(collectionName, {
    vectors: {
      size: 1536,
      distance: "Cosine",
    },
  });

  console.log(
    `Qdrant collection "${collectionName}" created`
  );
}