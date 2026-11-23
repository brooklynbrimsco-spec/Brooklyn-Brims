import { ContactForm } from "@/components/ContactForm";
import {
  INSTAGRAM_LABEL,
  INSTAGRAM_URL,
  SHOP_EMAIL,
  SHOP_EMAIL_MAILTO,
} from "@/lib/brand";
import { browserMailMode, web3formsKey } from "@/lib/mail";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const mailMode = browserMailMode();
  return (
    <div className="mx-auto max-w-xl px-5 py-16 sm:px-8">
      <h1 className="font-[family-name:var(--font-oswald)] text-5xl uppercase">Contact</h1>
      <p className="mt-3 text-sm text-muted">
        Questions, wholesale, or a hat that isn’t listed yet — send a note. It
        goes to our inbox at{" "}
        <a href={SHOP_EMAIL_MAILTO} className="text-ink underline">
          {SHOP_EMAIL}
        </a>
        . Instagram is{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-ink underline">
          {INSTAGRAM_LABEL}
        </a>
        {mailMode === "formsubmit"
          ? ". The first send asks that inbox to confirm; after you click that email, later notes show up there."
          : "."}
      </p>
      <div className="mt-10">
        <ContactForm
          mailMode={mailMode}
          web3formsAccessKey={web3formsKey()}
        />
      </div>
    </div>
  );
}
