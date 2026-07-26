import chunkText from '../chunking/recursive.chunker.js'
export default async function chunkStage(context) {
  context.chunks =
    await chunkText(context.extracted.text);

  context.stats.chunkCount =
    context.chunks.length;
}