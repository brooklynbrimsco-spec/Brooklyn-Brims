import Link from "next/link";
import {
  INSTAGRAM_LABEL,
  INSTAGRAM_URL,
  POMFRET_LABEL,
  POMFRET_URL,
} from "@/lib/brand";

type TickerItem = {
  kicker: string;
  name: string;
  href: string;
  external?: boolean;
};

const items: TickerItem[] = [
  { kicker: "Established", name: "2024", href: "/about" },
  { kicker: "Hats from", name: "Brooklyn, Connecticut", href: "/about" },
  { kicker: "One shop", name: "Snapbacks", href: "/shop" },
  {
    kicker: "Pomfret, CT",
    name: POMFRET_LABEL,
    href: POMFRET_URL,
    external: true,
  },
  {
    kicker: "On Instagram",
    name: INSTAGRAM_LABEL,
    href: INSTAGRAM_URL,
    external: true,
  },
];

function TickerLink({
  item,
  inert = false,
}: {
  item: TickerItem;
  inert?: boolean;
}) {
  const className =
    "flex flex-col whitespace-nowrap no-underline hover:underline";
  const body = (
    <>
      <span className="text-[9px] tracking-[0.18em] text-muted uppercase">
        {item.kicker}
      </span>
      <span className="text-sm font-medium text-ink">{item.name}</span>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        tabIndex={inert ? -1 : undefined}
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      tabIndex={inert ? -1 : undefined}
    >
      {body}
    </Link>
  );
}

function TickerRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      className="ticker-row flex shrink-0 flex-row flex-nowrap items-center"
      aria-hidden={duplicate || undefined}
    >
      {items.map((item) => (
        <li
          key={`${item.name}${duplicate ? "-dup" : ""}`}
          className="flex shrink-0 items-center"
        >
          <span className="px-8 py-5 sm:px-12">
            <TickerLink item={item} inert={duplicate} />
          </span>
          <span
            className="select-none px-1 text-xl font-serif italic text-ink/20 sm:text-2xl"
            aria-hidden
          >
            /
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TrustTicker() {
  return (
    <section
      className="shop-marks group overflow-hidden border-b border-line bg-[#f3f1ed]"
      aria-label="Shop marks"
    >
      <div className="ticker-track flex w-max flex-row flex-nowrap animate-ticker hover:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <TickerRow />
        <TickerRow duplicate />
      </div>
    </section>
  );
}
