export default function MarkdownTable(
  props
) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">

      <table
        {...props}
        className="w-full border-collapse text-sm"
      />

    </div>
  );
}