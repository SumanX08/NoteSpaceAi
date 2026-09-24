export default function MarkdownTable(props) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border bg-card/40">
      <table
        {...props}
        className="w-full border-collapse text-sm"
      />
    </div>
  );
}