import openai from "../../config/openai.js";

import buildPrompt from "./promptBuilder.js";

const MODEL =
  process.env.CHAT_MODEL ||
  "gpt-4.1-mini";


export default async function generateAnswer(
  question,
  chunks
) {

  const prompt =
    buildPrompt(question, chunks);


  const response =
    await openai.chat.completions.create({

      model: MODEL,

      temperature: 0,

      messages: [

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

      ],

    });


  const answer =
    response.choices[0]
      .message.content;


  const uniqueSources = [];

const seenSources = new Set();

for (const chunk of chunks) {
  const sourceId = chunk.sourceId.toString();

  if (seenSources.has(sourceId)) {
    continue;
  }

  seenSources.add(sourceId);

  uniqueSources.push({
    sourceId,
    page: chunk.page ?? null,
    chunkIndex: chunk.chunkIndex,
    score: chunk.score,
  });
}

const citations = uniqueSources.map(
  (citation, index) => ({
    index: index + 1,
    ...citation,
  })
);


  console.log(
    "RESULT CITATIONS:",
    citations
  );


  return {

    answer,

    citations,

  };
}