import { inngest } from "./client.js";

import { processSource } from "./functions/process-source.js";
import { generatePodcast } from "./functions/generate-podcast.js";

export const functions = [
  processSource,
  generatePodcast,
];

export { inngest };