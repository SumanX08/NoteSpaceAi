import extractSource from "../extractors/index.js";
import Source from "../../models/source.model.js";

export default async function extractStage(context) {
  console.log("EXTRACT STAGE START");

  const extracted =
    await extractSource(context.source);

  console.log(
    "EXTRACT RESULT:",
    extracted
  );

  console.log(
    "EXTRACT TEXT LENGTH:",
    extracted?.text?.length
  );

  if (!extracted?.text?.trim()) {
    throw new Error(
      "Extraction produced no text."
    );
  }

  context.extracted =
    extracted;

  // Persist extracted content so the
  // next Inngest step can reload it.
  await Source.findByIdAndUpdate(
    context.source._id,
    {
      content: extracted.text,
    }
  );

  return context;
}