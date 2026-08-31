import { YoutubeTranscript } from "youtube-transcript";

export default async function extractYoutube(source) {
  if (!source.url) {
    throw new Error(
      "YouTube URL is missing."
    );
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

  const segments = transcript.map((item) => ({
    text: item.text,
    startTime: item.offset,
    duration: item.duration,
    endTime:
      item.offset + item.duration,
  }));

  const text = segments
    .map((segment) => segment.text)
    .join(" ");

  return {
    text,

    segments,

    metadata: {
      url: source.url,

      duration:
        segments.at(-1)?.endTime || 0,
    },
  };
}