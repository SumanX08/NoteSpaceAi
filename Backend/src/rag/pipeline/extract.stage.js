import extractContent from "../extractors/index.js";

export default async function extractStage(context) {
  context.extracted = await extractContent(context.source);
  return context;
}