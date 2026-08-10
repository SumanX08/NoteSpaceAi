import extractSource from "../extractors/index.js";

export default async function extractStage(context) {
  const extracted = await extractSource(context.source);

  context.extracted = extracted;

  return context;
}