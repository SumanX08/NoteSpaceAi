export default function buildPrompt(question, chunks) {
  const context = chunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1} | Page ${chunk.page ?? "N/A"}]\n${chunk.text}`
    )
    .join("\n\n");

  return `
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

If the answer is not present in the context, say:
"I couldn't find that information in the uploaded documents."

Context:

${context}

Question:
${question}

Answer:
`;
}