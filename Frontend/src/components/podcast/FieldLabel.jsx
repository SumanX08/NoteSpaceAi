export default function FieldLabel({
  children,
}) {
  return (
    <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground-dim">
      {children}
    </p>
  );
}