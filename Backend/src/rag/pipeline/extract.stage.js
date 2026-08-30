import extractSource from "../extractors/index.js";

export default async function extractStage(context) {
  const extracted = await extractSource(context.source);

  console.log("EXTRACT RESULT:", extracted);
  console.log("EXTRACT TEXT LENGTH:", extracted?.text?.length);

  context.extracted = extracted;

  return context;
}