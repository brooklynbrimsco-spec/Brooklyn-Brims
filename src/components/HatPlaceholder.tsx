export function HatPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-paper ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 90"
        className="h-2/5 w-2/5 text-navy/35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 62c8 10 28 16 42 16s34-6 42-16" />
        <path d="M22 58c2-18 16-32 38-32s36 14 38 32" />
        <path d="M36 46c6-8 14-12 24-12s18 4 24 12" />
        <path d="M12 62h96" />
      </svg>
    </div>
  );
}
