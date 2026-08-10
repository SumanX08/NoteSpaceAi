import { inngest } from "./client.js";
import { processSource } from "./functions/process-source.js";

export const functions = [
  processSource,
];

export { inngest };