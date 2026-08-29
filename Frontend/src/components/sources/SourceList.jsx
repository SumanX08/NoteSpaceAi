import SourceCard from "./SourceCard";

export default function SourceList({
  sources,
  onDelete,
}) {
  return (
    <div className="mt-6 grid gap-4">

      {sources.map((source) => (
        <SourceCard
          key={source._id}
          source={source}
          onDelete={onDelete}
        />
      ))}

    </div>
  );
}