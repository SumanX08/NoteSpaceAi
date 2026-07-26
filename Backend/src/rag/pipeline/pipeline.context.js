export default class PipelineContext {
  constructor(source) {
    this.source = source;

    this.extracted = null;

    this.chunks = [];

    this.embeddedChunks = [];

    this.stats = {
      chunkCount: 0,
      processingTime: 0,
    };
  }
}