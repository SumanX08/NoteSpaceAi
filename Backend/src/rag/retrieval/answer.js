import openai from "../../config/openai.js";
import buildPrompt from "./promptBuilder.js";

const MODEL = process.env.CHAT_MODEL || "gpt-4.1-mini";

export default async function generateAnswer(question, chunks) {
  const prompt = buildPrompt(question, chunks);

  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "Answer ONLY from the provided context. If the answer is not in the context, clearly say you couldn't find it.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return {
    answer: response.choices[0].message.content,
    citations: chunks.map((chunk) => ({
      sourceId: chunk.sourceId,
      page: chunk.page,
      score: chunk.score,
    })),
  };
}