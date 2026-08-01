import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Phone, X, Check } from "lucide-react";

function ledgerBase(): string {
  const raw = typeof process !== "undefined" ? process.env.LEDGER_PUBLIC_URL : undefined;
  const trimmed = raw?.trim().replace(/\/+$/, "") ?? "";
  return /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(trimmed)
    ? trimmed
    : trimmed.replace(/^http:\/\//, "https://");
}

type Appt = {
  clientName: string | null;
  serviceName: string | null;
  date: string;
  time: string;
  status: string;
  cancelCutoffHours: number;
};

const prettyDate = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};
const prettyTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const Route = createFileRoute("/cancel")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
  }),
  loader: () => ({ base: ledgerBase() }),
  head: () => ({ meta: [{ title: "Cancel appointment — NXM Nails" }] }),
  component: CancelPage,
});

function CancelPage() {
  const { token } = Route.useSearch();
  const { base } = Route.useLoaderData();
  const [appt, setAppt] = useState<Appt | "loading" | "notfound">("loading");
  const [busy, setBusy] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !base) {
      setAppt("notfound");
      return;
    }
    fetch(`${base}/api/book/appointment?token=${encodeURIComponent(token)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { appointment?: Appt } | null) => setAppt(d?.appointment ?? "notfound"))
      .catch(() => setAppt("notfound"));
  }, [token, base]);

  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/book/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await res.json();
      if (d.ok) setCancelled(true);
      else setError(d.error || "We couldn't cancel that. Please call the studio.");
    } catch {
      setError("Couldn't reach the studio. Please call to cancel.");
    } finally {
      setBusy(false);
    }
  }

  const alreadyDone =
    appt !== "loading" && appt !== "notfound" && (appt.status !== "booked" || cancelled);

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-luxe">
        <p
          className="text-2xl tracking-[0.28em] text-cream"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          NXM
        </p>

        {appt === "loading" ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading your appointment…</p>
        ) : appt === "notfound" ? (
          <>
            <h1 className="mt-6 text-display text-cream text-2xl">Appointment not found</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              This link may have expired or already been used. If you still need to cancel, please
              call the studio.
            </p>
            <a href="tel:+15052368383" className="btn-luxe mt-8 inline-flex">
              <Phone className="size-4" /> Call the studio
            </a>
          </>
        ) : cancelled || appt.status === "cancelled" ? (
          <>
            <div className="mx-auto mt-6 grid size-12 place-items-center rounded-full border border-bronze/40 text-bronze-soft">
              <Check className="size-6" />
            </div>
            <h1 className="mt-4 text-display text-cream text-2xl">Appointment cancelled</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {appt.serviceName} on {prettyDate(appt.date)} at {prettyTime(appt.time)} has been
              cancelled. We hope to see you again soon!
            </p>
          </>
        ) : alreadyDone ? (
          <>
            <h1 className="mt-6 text-display text-cream text-2xl">Nothing to cancel</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              This appointment can't be cancelled online. Please call the studio with any questions.
            </p>
            <a href="tel:+15052368383" className="btn-luxe mt-8 inline-flex">
              <Phone className="size-4" /> Call the studio
            </a>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-display text-cream text-2xl">Cancel this appointment?</h1>
            <div className="mt-5 rounded-xl border border-border bg-surface/60 p-4 text-left">
              <p className="flex items-center gap-2 text-cream">
                <Calendar className="size-4 text-bronze-soft" /> {appt.serviceName}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {prettyDate(appt.date)} at {prettyTime(appt.time)}
              </p>
            </div>
            {appt.cancelCutoffHours > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Online cancellation closes {appt.cancelCutoffHours} hours before your appointment.
              </p>
            )}
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            <div className="mt-8 flex flex-col gap-2">
              <button className="btn-luxe" onClick={cancel} disabled={busy}>
                <X className="size-4" /> {busy ? "Cancelling…" : "Yes, cancel my appointment"}
              </button>
              <a href="/" className="btn-ghost justify-center">
                Keep my appointment
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
