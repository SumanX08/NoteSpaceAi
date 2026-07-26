import fs from "fs/promises";

export default async function extractTextFile(
  source
) {
  const text = await fs.readFile(
    source.content.location,
    "utf-8"
  );

  return {
    text,
    pages: 1,
    metadata: {},
  };
}