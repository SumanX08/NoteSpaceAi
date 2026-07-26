import mammoth from "mammoth";

export default async function extractDocx(
  source
) {
  const result =
    await mammoth.extractRawText({
      path: source.content.location,
    });

  return {
    text: result.value,
    pages: null,
    metadata: {},
  };
}