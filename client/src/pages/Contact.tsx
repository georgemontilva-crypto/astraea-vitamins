import { useState } from "react";
import { trpc } from "../lib/trpc";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const send = trpc.contact.send.useMutation();

  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="eyebrow">Contact</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 34, margin: "8px 0 12px" }}>
          Get in touch
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}>
          Questions about an order, a product, or a batch result? We read every message.
        </p>

        {send.isSuccess ? (
          <div className="infocard" style={{ borderLeft: "3px solid var(--verify)", paddingLeft: 18 }}>
            <h4>Message sent</h4>
            <p>Thanks! We'll get back to you as soon as we can.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send.mutate({ name, email, message });
            }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: "13px 14px", border: "1px solid var(--hair)", fontFamily: "Karla,sans-serif", fontSize: 15 }}
            />
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "13px 14px", border: "1px solid var(--hair)", fontFamily: "Karla,sans-serif", fontSize: 15 }}
            />
            <textarea
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              style={{ padding: "13px 14px", border: "1px solid var(--hair)", fontFamily: "Karla,sans-serif", fontSize: 15, resize: "vertical" }}
            />
            {send.isError && <p style={{ color: "#8c2f22", fontSize: 13.5 }}>{send.error.message}</p>}
            <button className="btn" type="submit" style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }} disabled={send.isPending}>
              {send.isPending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
