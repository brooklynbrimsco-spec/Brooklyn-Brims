import {
  INSTAGRAM_LABEL,
  INSTAGRAM_URL,
  SHOP_EMAIL,
  SHOP_EMAIL_MAILTO,
} from "@/lib/brand";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-sky uppercase">Est. 2024</p>
      <h1 className="mt-2 font-[family-name:var(--font-oswald)] text-5xl uppercase">
        About Brooklyn Brims
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
        <p>
          It started in the basement during study hall in the fall of our
          junior year. We had an ambition to create something of our own —
          something new, exciting, and worth building. At the time, hats were
          everywhere, and we saw an opportunity to turn a shared interest into
          something real. What began as an idea quickly turned into a project.
          We started brainstorming and designing, trying to figure out what it
          would take to bring our idea to life.
          <br />
          That idea became Brooklyn Brims. What started as a conversation
          between friends grew into a brand we're proud to call our own.
        </p>
        <p>
          Inspired by where we're from and built around what we love, Brooklyn
          Brims is a collection of styles made to be worn, enjoyed, and lived
          in.{" "}
          <strong className="font-semibold text-ink">
            One shop. One collection.
          </strong>
        </p>
        <p>
          If you want a hat that isn’t on the rack yet, use the contact form
          or email{" "}
          <a href={SHOP_EMAIL_MAILTO} className="text-ink underline">
            {SHOP_EMAIL}
          </a>
          . We’re also on Instagram as{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-ink underline">
            {INSTAGRAM_LABEL}
          </a>
          . We promise you won't regret following 😉
        </p>
      </div>
    </div>
  );
}
