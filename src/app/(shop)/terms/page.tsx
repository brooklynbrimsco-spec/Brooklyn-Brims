import { SHOP_EMAIL, SHOP_EMAIL_MAILTO } from "@/lib/brand";
import {
  TERMS_LAST_UPDATED,
  termsIntro,
  termsSections,
  type TermsBlock,
} from "@/content/terms";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions for Brooklyn Brims Hat Co., including orders, shipping, returns, and website use.",
};

function LinkedText({ text }: { text: string }) {
  const parts = text.split(/(https:\/\/brooklyn-brims\.vercel\.app\/?|brooklynbrims\.co@gmail\.com)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part === SHOP_EMAIL) {
          return (
            <a key={index} href={SHOP_EMAIL_MAILTO} className="text-ink underline">
              {part}
            </a>
          );
        }
        if (part.startsWith("https://brooklyn-brims.vercel.app")) {
          return (
            <a
              key={index}
              href={part}
              className="break-all text-ink underline"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function Blocks({ blocks }: { blocks: TermsBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return (
            <p key={index}>
              <LinkedText text={block.text} />
            </p>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={index}
              className="pt-2 font-semibold text-ink"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-sky uppercase">
        Brooklyn Brims Hat Co.
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-oswald)] text-4xl uppercase sm:text-5xl">
        Terms & Conditions
      </h1>
      <p className="mt-3 text-sm text-muted">
        Last Updated: {TERMS_LAST_UPDATED}
      </p>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
        {termsIntro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-12 space-y-12 text-sm leading-relaxed text-muted">
        {termsSections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-[family-name:var(--font-oswald)] text-xl uppercase tracking-wide text-ink">
              {section.heading}
            </h2>
            <div className="mt-4">
              <Blocks blocks={section.blocks} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
