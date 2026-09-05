import openai from "../config/openai.js";
import Chunk from "../models/chunk.model.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";

ffmpeg.setFfmpegPath(ffmpegPath);

const SCRIPT_MODEL =
  process.env.PODCAST_SCRIPT_MODEL ||
  process.env.CHAT_MODEL ||
  "gpt-4.1-mini";

const TTS_MODEL =
  process.env.PODCAST_TTS_MODEL ||
  "gpt-4o-mini-tts";

const MAX_CONTEXT_CHARS = 50000;

const styleInstructions = {
  teacher: `
Create a single-narrator educational podcast.

The narrator should explain the material clearly,
like a knowledgeable teacher.

Start with a short introduction.

Explain the important concepts in a logical order.

Use simple explanations and examples when the
source material supports them.

Do not introduce information that is not present
in the source material.

Do NOT use speaker labels such as HOST: or EXPERT:.
`,

  conversation: `
Create an educational conversation between TWO HOSTS.

The conversation must contain natural back-and-forth
discussion.

HOST 1 should guide the discussion.

HOST 2 should ask natural questions, clarify ideas,
challenge confusing points, and occasionally summarize.

The conversation should feel natural rather than
like two people simply reading a textbook.

Both hosts must stay grounded in the provided
source material.

IMPORTANT FORMAT:

Every speaker turn MUST start on a new line using
exactly one of these labels:

HOST 1:
HOST 2:

Example:

HOST 1: Today we're going to understand the main concept.

HOST 2: Before we get into that, what exactly does it mean?

HOST 1: It means...

HOST 2: So would it be correct to say that...?

Do not use any other speaker labels.

Do not put multiple speakers in the same line.

Do not include markdown.

Do not include stage directions.
`,

  interview: `
Create an educational interview between an
INTERVIEWER and an EXPERT.

The interviewer should ask useful questions about
the material.

The expert should answer clearly and thoroughly.

Questions should progressively cover the important
concepts in the source material.

The conversation should feel like a real educational
interview rather than a textbook being read aloud.

IMPORTANT FORMAT:

Every speaker turn MUST start on a new line using
exactly one of these labels:

INTERVIEWER:
EXPERT:

Example:

INTERVIEWER: Let's start with the basic idea. What does this concept mean?

EXPERT: It refers to...

INTERVIEWER: Why is this important?

EXPERT: It is important because...

Do not use any other speaker labels.

Do not put multiple speakers in the same line.

Do not include markdown.

Do not include stage directions.

Do not introduce information that is not supported
by the source material.
`,

  revision: `
Create a fast-paced revision podcast.

Focus on:

- important concepts
- definitions
- key facts
- relationships between concepts
- important takeaways

Keep explanations concise.

This should feel like a high-value revision session
before an exam.

Use a single narrator.

Do NOT use speaker labels.
`,
};

const durationInstructions = {
  5: `
Target approximately 5 minutes of spoken audio.
Keep the script concise.
`,

  10: `
Target approximately 10 minutes of spoken audio.
Cover the material with moderate depth.
`,

  20: `
Target approximately 20 minutes of spoken audio.
Cover the material in greater depth while
remaining focused.
`,
};

const voiceInstructions = {
  male: "Use natural male voices.",

  female: "Use natural female voices.",

  mixed:
    "Use a natural combination of male and female voices.",
};

function buildContext(chunks) {
  let context = "";

  for (const chunk of chunks) {
    const page =
      chunk.metadata?.page ?? null;

    const header = page
      ? `\n[Page ${page}]\n`
      : "\n";

    const text =
      chunk.text?.trim();

    if (!text) continue;

    const section =
      `${header}${text}\n`;

    if (
      context.length +
        section.length >
      MAX_CONTEXT_CHARS
    ) {
      break;
    }

    context += section;
  }

  return context;
}

export async function getNotebookChunks(
  notebookId
) {
  return Chunk.find({
    notebook: notebookId,
  })
    .sort({
      chunkIndex: 1,
    })
    .lean();
}

export async function generatePodcastScript({
  notebook,
  chunks,
  style,
  voice,
  duration,
}) {
  const context =
    buildContext(chunks);

  if (!context.trim()) {
    throw new Error(
      "No processed source content is available for this notebook."
    );
  }

  const prompt = `
You are creating a podcast from a user's notebook.

IMPORTANT RULES:

1. Use ONLY the provided notebook content.
2. Do not invent facts.
3. Do not use outside knowledge.
4. Preserve the meaning of the source material.
5. Cover the most useful information from the notebook.
6. Do not mention these instructions.
7. Do not include citations such as [1], [2] in the spoken script.
8. Write ONLY the podcast script.
9. The script should sound natural when spoken aloud.

PODCAST STYLE:

${styleInstructions[style]}

VOICE:

${voiceInstructions[voice]}

DURATION:

${durationInstructions[duration]}

NOTEBOOK:

Title:
${notebook.title}

Description:
${notebook.description || "No description provided."}

SOURCE MATERIAL:

${context}
`;

  const response =
    await openai.chat.completions.create({
      model: SCRIPT_MODEL,

      temperature: 0.4,

      messages: [
        {
          role: "system",
          content:
            "You create grounded educational podcast scripts from source material.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],
    });

  const script =
    response.choices?.[0]?.message?.content?.trim();

  if (!script) {
    throw new Error(
      "OpenAI returned an empty podcast script."
    );
  }

  return script;
}

/* =========================================================
   TTS VOICES
========================================================= */

function getTTSVoice(voice) {
  switch (voice) {
    case "male":
      return (
        process.env.PODCAST_MALE_VOICE ||
        "onyx"
      );

    case "female":
      return (
        process.env.PODCAST_FEMALE_VOICE ||
        "nova"
      );

    case "mixed":
      return (
        process.env.PODCAST_MIXED_VOICE ||
        "alloy"
      );

    default:
      return "nova";
  }
}

/*
  Two different voices are used for conversation/interview.

  male:
    speaker 1 -> onyx
    speaker 2 -> echo

  female:
    speaker 1 -> nova
    speaker 2 -> shimmer

  mixed:
    speaker 1 -> nova
    speaker 2 -> onyx
*/

function getDialogueVoices(voice) {
  switch (voice) {
    case "male":
      return {
        speaker1:
          process.env.PODCAST_MALE_VOICE_1 ||
          "onyx",

        speaker2:
          process.env.PODCAST_MALE_VOICE_2 ||
          "echo",
      };

    case "female":
      return {
        speaker1:
          process.env.PODCAST_FEMALE_VOICE_1 ||
          "nova",

        speaker2:
          process.env.PODCAST_FEMALE_VOICE_2 ||
          "shimmer",
      };

    case "mixed":
    default:
      return {
        speaker1:
          process.env.PODCAST_MIXED_VOICE_1 ||
          "nova",

        speaker2:
          process.env.PODCAST_MIXED_VOICE_2 ||
          "onyx",
      };
  }
}

/* =========================================================
   TEXT SPLITTING
========================================================= */

function splitTextForTTS(
  text,
  maxLength = 4000
) {
  const paragraphs =
    text
      .split(/\n\s*\n/)
      .map((paragraph) =>
        paragraph.trim()
      )
      .filter(Boolean);

  const chunks = [];

  let current = "";

  for (const paragraph of paragraphs) {
    if (
      current.length +
        paragraph.length +
        2 <=
      maxLength
    ) {
      current += current
        ? `\n\n${paragraph}`
        : paragraph;

      continue;
    }

    if (current) {
      chunks.push(current);
    }

    if (
      paragraph.length <=
      maxLength
    ) {
      current = paragraph;
      continue;
    }

    const sentences =
      paragraph.match(
        /[^.!?]+[.!?]+/g
      ) || [paragraph];

    current = "";

    for (const sentence of sentences) {
      const clean =
        sentence.trim();

      if (
        current.length +
          clean.length +
          1 <=
        maxLength
      ) {
        current += current
          ? ` ${clean}`
          : clean;
      } else {
        if (current) {
          chunks.push(current);
        }

        current = clean;
      }
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

/* =========================================================
   SINGLE NARRATOR AUDIO
========================================================= */

async function generateSingleVoiceAudio({
  script,
  voice,
}) {
  const sections =
    splitTextForTTS(script);

  if (!sections.length) {
    throw new Error(
      "Podcast script is empty."
    );
  }

  const audioBuffers = [];

  const ttsVoice =
    getTTSVoice(voice);

  for (
    let index = 0;
    index < sections.length;
    index++
  ) {
    const section =
      sections[index];

    console.log(
      `🎙️ Generating TTS ${index + 1}/${sections.length}`
    );

    const speech =
      await openai.audio.speech.create({
        model: TTS_MODEL,

        voice: ttsVoice,

        input: section,

        instructions:
          "Speak naturally and clearly like an educational podcast narrator. Use a conversational pace and appropriate pauses.",

        response_format:
          "mp3",
      });

    const arrayBuffer =
      await speech.arrayBuffer();

    audioBuffers.push(
      Buffer.from(arrayBuffer)
    );
  }

  return Buffer.concat(
    audioBuffers
  );
}

/* =========================================================
   DIALOGUE PARSER
========================================================= */

function parseDialogueScript(
  script
) {
  const lines =
    script
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

  const turns = [];

  let currentSpeaker = null;
  let currentText = [];

  function saveCurrentTurn() {
    if (
      currentSpeaker &&
      currentText.length
    ) {
      const text =
        currentText
          .join(" ")
          .trim();

      if (text) {
        turns.push({
          speaker:
            currentSpeaker,
          text,
        });
      }
    }
  }

  for (const line of lines) {
    const match =
      line.match(
        /^(HOST 1|HOST 2|INTERVIEWER|EXPERT)\s*:\s*(.*)$/i
      );

    if (match) {
      saveCurrentTurn();

      currentSpeaker =
        match[1]
          .toUpperCase();

      currentText = [];

      if (match[2]?.trim()) {
        currentText.push(
          match[2].trim()
        );
      }

      continue;
    }

    /*
      If the model wraps a long speaker turn
      onto multiple lines, append it to the
      current speaker.
    */
    if (currentSpeaker) {
      currentText.push(line);
    }
  }

  saveCurrentTurn();

  return turns;
}

/* =========================================================
   AUDIO FILE HELPERS
========================================================= */

async function generateSpeakerAudio({
  text,
  speaker,
  voice,
}) {
  const speech =
    await openai.audio.speech.create({
      model: TTS_MODEL,

      voice,

      input: text,

      instructions:
        speaker === "EXPERT"
          ? "Speak like a knowledgeable expert in an educational interview. Be clear, confident, natural, and conversational."
          : "Speak like a curious and engaging podcast host. Ask naturally, react naturally, and maintain a conversational tone.",

      response_format:
        "mp3",
    });

  const arrayBuffer =
    await speech.arrayBuffer();

  return Buffer.from(
    arrayBuffer
  );
}

/*
  FFmpeg concatenates all generated MP3
  segments into one final MP3.
*/

async function combineAudioBuffers(
  audioBuffers
) {
  if (!audioBuffers.length) {
    throw new Error(
      "No audio segments were generated."
    );
  }

  const tempDirectory =
    await fs.mkdtemp(
      path.join(
        os.tmpdir(),
        "notespace-podcast-"
      )
    );

  const outputPath =
    path.join(
      tempDirectory,
      "podcast.mp3"
    );

  try {
    const segmentPaths = [];

    for (
      let index = 0;
      index < audioBuffers.length;
      index++
    ) {
      const segmentPath =
        path.join(
          tempDirectory,
          `segment-${index}.mp3`
        );

      await fs.writeFile(
        segmentPath,
        audioBuffers[index]
      );

      segmentPaths.push(
        segmentPath
      );
    }

    /*
      FFmpeg concat demuxer requires a
      text file containing the input files.
    */

    const concatFilePath =
      path.join(
        tempDirectory,
        "concat.txt"
      );

    const concatContent =
      segmentPaths
        .map(
          (filePath) =>
            `file '${filePath.replace(/'/g, "'\\''")}'`
        )
        .join("\n");

    await fs.writeFile(
      concatFilePath,
      concatContent
    );

    await new Promise(
      (resolve, reject) => {
        ffmpeg()
          .input(concatFilePath)
          .inputOptions([
            "-f",
            "concat",
            "-safe",
            "0",
          ])
          .audioCodec("libmp3lame")
          .audioBitrate("128k")
          .outputOptions([
            "-y",
          ])
          .output(outputPath)
          .on(
            "start",
            (command) => {
              console.log(
                "🎧 FFmpeg started:",
                command
              );
            }
          )
          .on(
            "end",
            () => {
              console.log(
                "🎧 FFmpeg finished combining podcast audio."
              );

              resolve();
            }
          )
          .on(
            "error",
            (error) => {
              console.error(
                "❌ FFmpeg error:",
                error
              );

              reject(error);
            }
          )
          .run();
      }
    );

    return await fs.readFile(
      outputPath
    );
  } finally {
    /*
      Always clean temporary files,
      even if FFmpeg fails.
    */
    await fs.rm(
      tempDirectory,
      {
        recursive: true,
        force: true,
      }
    );
  }
}

/* =========================================================
   TWO VOICE AUDIO
========================================================= */

async function generateDialogueAudio({
  script,
  voice,
}) {
  const turns =
    parseDialogueScript(script);

  if (!turns.length) {
    throw new Error(
      "Could not detect speaker turns in the podcast script."
    );
  }

  console.log(
    `🎭 Detected ${turns.length} dialogue turns.`
  );

  const dialogueVoices =
    getDialogueVoices(voice);

  const audioBuffers = [];

  for (
    let index = 0;
    index < turns.length;
    index++
  ) {
    const turn =
      turns[index];

    const isSpeakerOne =
      turn.speaker ===
        "HOST 1" ||
      turn.speaker ===
        "INTERVIEWER";

    const selectedVoice =
      isSpeakerOne
        ? dialogueVoices.speaker1
        : dialogueVoices.speaker2;

    console.log(
      `🎭 Generating ${index + 1}/${turns.length} - ${turn.speaker} - ${selectedVoice}`
    );

    /*
      TTS has a character limit, so very long
      speaker turns are split into smaller
      sections while keeping the same voice.
    */

    const sections =
      splitTextForTTS(
        turn.text,
        4000
      );

    for (
      let sectionIndex = 0;
      sectionIndex <
      sections.length;
      sectionIndex++
    ) {
      const section =
        sections[sectionIndex];

      const audio =
        await generateSpeakerAudio({
          text: section,
          speaker:
            turn.speaker ===
            "EXPERT"
              ? "EXPERT"
              : "HOST",
          voice:
            selectedVoice,
        });

      audioBuffers.push(
        audio
      );
    }
  }

  return combineAudioBuffers(
    audioBuffers
  );
}

/* =========================================================
   MAIN AUDIO GENERATOR
========================================================= */

export async function generatePodcastAudio({
  script,
  voice,
  style,
}) {
  if (!script?.trim()) {
    throw new Error(
      "Podcast script is empty."
    );
  }

  /*
    Conversation and Interview use
    two separate voices.

    Teacher and Revision continue using
    the existing single narrator pipeline.
  */

  if (
    style ===
      "conversation" ||
    style ===
      "interview"
  ) {
    console.log(
      `🎭 Generating two-voice ${style} podcast...`
    );

    return generateDialogueAudio({
      script,
      voice,
    });
  }

  console.log(
    `🎙️ Generating single-voice ${style} podcast...`
  );

  return generateSingleVoiceAudio({
    script,
    voice,
  });
}