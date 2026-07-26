import Source from "../../models/source.model.js";

export default async function finalizeStage(context) {
  await Source.findByIdAndUpdate(context.source._id, {
    status: "ready",
    indexedAt: new Date(),
  });

  context.source.status = "ready";
}