import SourceCard from "./SourceCard";

export default function SourceList({
  sources = [],
}) {
  if (!sources.length) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No sources used for this response.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 px-4">

      {sources.map((source) => (
        <SourceCard
          key={source._id || source.id}
          source={source}
        />
      ))}

    </div>
  );
}