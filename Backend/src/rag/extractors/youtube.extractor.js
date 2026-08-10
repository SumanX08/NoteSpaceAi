import { YoutubeTranscript } from "youtube-transcript";

export default async function extractYoutube(source) {
  if (!source.url) {
    throw new Error("YouTube URL is missing.");
  }

  const transcript =
    await YoutubeTranscript.fetchTranscript(
      source.url
    );

  if (!transcript || transcript.length === 0) {
    throw new Error(
      "No transcript found for this YouTube video."
    );
  }

  const text = transcript
    .map((item) => item.text)
    .join(" ");

  return {
    text,

    metadata: {
      url: source.url,
      duration: transcript.at(-1)?.offset || 0,
    },
  };
}