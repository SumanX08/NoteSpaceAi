export default function buildPrompt(question, chunks) {
  const context = chunks
    .map(
      (chunk, index) => `
[${index + 1}]
Source ID: ${chunk.sourceId}
Page: ${chunk.page ?? "N/A"}
Chunk: ${chunk.chunkIndex}

${chunk.text}
`
    )
    .join("\n\n---\n\n");

  return `
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

CITATION RULES:
- Every factual statement based on the context should include a citation.
- Use citation numbers in this exact format: [1], [2], [3].
- Citation numbers correspond to the numbered context blocks.
- Only cite a context block that directly supports the statement.
- Do not invent citation numbers.
- Do not mention "Source ID" or "Chunk" in your answer.
- Do not list all citations unnecessarily.
- If one context block supports the whole answer, use only that citation.

If the answer is not present in the context, say exactly:
"I couldn't find that information in the uploaded documents."

Context:

${context}

Question:
${question}

Answer:
`;
}