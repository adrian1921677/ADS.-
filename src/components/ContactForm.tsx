"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Loader2, Car, MapPin, Calendar } from "lucide-react";

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
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      pickupLocation: (form.elements.namedItem("pickupLocation") as HTMLInputElement).value,
      destination: (form.elements.namedItem("destination") as HTMLInputElement).value,
      vehicleType: (form.elements.namedItem("vehicleType") as HTMLInputElement).value,
      readyToDrive: (form.elements.namedItem("readyToDrive") as HTMLSelectElement).value,
      preferredDate: (form.elements.namedItem("preferredDate") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      gdprConsent: (form.elements.namedItem("gdprConsent") as HTMLInputElement).checked,
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
    <div className="w-full max-w-4xl">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Persönliche Daten */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Car className="h-5 w-5 mr-2 text-primary-600" />
            Persönliche Daten
          </h3>
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
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                Telefon <span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+49 (0) 123 456 789"
                className="h-12 text-base"
                required
              />
            </div>
          </div>
        </div>

        {/* Transportdaten */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
            Transportdaten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="pickupLocation" className="block text-sm font-medium text-neutral-700">
                Abholort <span className="text-red-500">*</span>
              </label>
              <Input
                id="pickupLocation"
                name="pickupLocation"
                placeholder="z.B. München, Hauptbahnhof"
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="destination" className="block text-sm font-medium text-neutral-700">
                Zielort <span className="text-red-500">*</span>
              </label>
              <Input
                id="destination"
                name="destination"
                placeholder="z.B. Hamburg, Altona"
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-neutral-700">
                Fahrzeugtyp / Kennzeichen
              </label>
              <Input
                id="vehicleType"
                name="vehicleType"
                placeholder="z.B. BMW 3er, M-AB 123 CD"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="readyToDrive" className="block text-sm font-medium text-neutral-700">
                Fahrbereit?
              </label>
              <select
                id="readyToDrive"
                name="readyToDrive"
                className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base"
              >
                <option value="">Bitte wählen</option>
                <option value="ja">Ja</option>
                <option value="nein">Nein</option>
              </select>
            </div>
          </div>
        </div>

        {/* Termin und Nachricht */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            Termin & Nachricht
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="preferredDate" className="block text-sm font-medium text-neutral-700">
                Wunschtermin
              </label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
                Nachricht / Hinweise
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Besondere Wünsche, Hinweise zum Fahrzeug oder weitere Informationen..."
                rows={4}
                className="text-base resize-none"
              />
            </div>
          </div>
        </div>

        {/* GDPR Consent */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="gdprConsent"
              name="gdprConsent"
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              required
            />
            <label htmlFor="gdprConsent" className="text-sm text-neutral-700">
              Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
              <a href="/datenschutz" className="text-primary-600 hover:underline">
                Datenschutzerklärung
              </a>{' '}
              zu. <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        {/* Honeypot (ausblenden per CSS) */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full transform hover:scale-105 active:scale-95"
            disabled={state === "sending"}
          >
            {state === "sending" ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Angebot wird angefordert...
              </>
            ) : (
              "Kostenloses Angebot anfordern"
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {state === "ok" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-green-800 font-medium">Angebot erfolgreich angefordert!</p>
                <p className="text-green-700 text-sm">
                  Vielen Dank für Ihre Anfrage. Wir erstellen Ihnen ein individuelles Angebot und melden uns schnellstmöglich bei Ihnen.
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
