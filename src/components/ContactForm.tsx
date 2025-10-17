"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
    <div className="w-full max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name und E-Mail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Ihr vollständiger Name"
              className="h-12 text-base"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              E-Mail <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ihre@email.de"
              className="h-12 text-base"
              required
            />
          </div>
        </div>

        {/* Nachricht */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
            Nachricht <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Beschreiben Sie Ihr Anliegen oder stellen Sie Ihre Fragen..."
            rows={6}
            className="text-base resize-none"
            required
          />
        </div>

        {/* Honeypot (ausblenden per CSS) */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={state === "sending"}
          >
            {state === "sending" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              "Nachricht senden"
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {state === "ok" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-green-800 font-medium">Vielen Dank!</p>
                <p className="text-green-700 text-sm">
                  Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.
                </p>
              </div>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Fehler beim Senden</p>
                <p className="text-red-700 text-sm">
                  {error || "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch."}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
