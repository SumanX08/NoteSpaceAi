import openai from "../../config/openai.js";
import buildPrompt from "./promptBuilder.js";

const MODEL =
  process.env.CHAT_MODEL ||
  "gpt-4.1-mini";

export function buildAnswerMessages(question, chunks) {
  const prompt = buildPrompt(question, chunks);

  return [
    {
      role: "system",
      content: `
You are a research assistant.

Answer ONLY using the provided context.

Every factual claim must include a citation.

Citations must use this exact format:

[1]
[2]
[3]

The number refers to the context source number.

Example:

Visakhapatnam is mentioned as Suman's location. [1]

If multiple sources support a statement:

The information is supported by multiple sources. [1][2]

If the answer is not available in the context, say:

"I couldn't find this information in the provided sources."

Do not invent information.
Do not cite information that is not present in the context.
      `.trim(),
    },
    {
      role: "user",
      content: prompt,
    },
  ];
}

export function buildCitations(answer, chunks) {
  const usedCitationIndexes = [
    ...new Set(
      [...answer.matchAll(/\[(\d+)\]/g)]
        .map((match) => Number(match[1]))
    ),
  ];

  return usedCitationIndexes
    .map((index) => {
      const chunk = chunks[index - 1];

      if (!chunk) {
        return null;
      }

      return {
        index,

        sourceId:
          String(chunk.sourceId),

        page:
          chunk.page ??
          chunk.metadata?.page ??
          null,

        chunkIndex:
          chunk.chunkIndex,

        score:
          chunk.score,

        text:
          chunk.text,

        start:
          chunk.start ??
          chunk.metadata?.start ??
          null,

        end:
          chunk.end ??
          chunk.metadata?.end ??
          null,

        startTime:
          chunk.startTime ??
          chunk.metadata?.startTime ??
          null,

        endTime:
          chunk.endTime ??
          chunk.metadata?.endTime ??
          null,
      };
    })
    .filter(Boolean);
}


// Normal non-streaming version
export default async function generateAnswer(
  question,
  chunks
) {
  const response =
    await openai.chat.completions.create({
      model: MODEL,
      temperature: 0,
      messages: buildAnswerMessages(
        question,
        chunks
      ),
    });

  const answer =
    response.choices[0]?.message?.content || "";

  const citations =
    buildCitations(answer, chunks);

  return {
    answer,
    citations,
  };
}

export async function streamAnswer(
  question,
  chunks,
  onToken
) {
  const stream =
    await openai.chat.completions.create({
      model: MODEL,
      temperature: 0,
      stream: true,
      messages: buildAnswerMessages(
        question,
        chunks
      ),
    });

  let fullAnswer = "";

  for await (const part of stream) {
    const token =
      part.choices[0]?.delta?.content || "";

    if (!token) continue;

    fullAnswer += token;

    onToken(token);
  }

  return {
    answer: fullAnswer,
    citations: buildCitations(
      fullAnswer,
      chunks
    ),
  };
}
