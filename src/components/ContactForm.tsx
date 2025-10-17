"use client";
import { useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState<"idle"|"sending"|"ok"|"error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement)?.value ?? "",
    };
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok && json.ok) setState("ok");
    else { setError(json.error ?? "Fehler beim Senden"); setState("error"); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-md">
      <input name="name" placeholder="Dein Name" className="w-full border p-2" required />
      <input name="email" type="email" placeholder="Deine E-Mail" className="w-full border p-2" required />
      <textarea name="message" placeholder="Nachricht" className="w-full border p-2 h-32" required />
      {/* Honeypot (ausblenden per CSS) */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <button disabled={state==="sending"} className="border px-4 py-2">
        {state==="sending" ? "Senden…" : "Absenden"}
      </button>
      {state==="ok" && <p className="text-green-600">Danke! Nachricht gesendet.</p>}
      {state==="error" && <p className="text-red-600">{error}</p>}
    </form>
  );
}
