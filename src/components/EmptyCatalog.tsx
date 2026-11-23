export function EmptyCatalog({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-lg border border-dashed border-line bg-paper/70 px-8 py-16 text-center">
      <p className="font-[family-name:var(--font-newsreader)] text-2xl text-navy">
        {title}
      </p>
      <p className="mt-3 text-muted leading-relaxed">{body}</p>
    </div>
  );
}
