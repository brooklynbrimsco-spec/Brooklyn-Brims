import { listContactMessages } from "@/lib/orders";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-newsreader)] text-3xl text-navy">
        Messages
      </h1>
      {messages.length === 0 ? (
        <p className="mt-10 border border-dashed border-line bg-paper px-6 py-12 text-center text-muted">
          No contact notes yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((message) => (
            <li key={message.id} className="border border-line bg-paper p-5">
              <p className="text-sm font-medium text-navy">{message.name}</p>
              <p className="text-xs text-muted">
                {message.email} · {new Date(message.createdAt).toLocaleString()}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
