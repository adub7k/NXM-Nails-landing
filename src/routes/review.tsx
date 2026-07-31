import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";

function ledgerBaseFromEnv() {
  const raw = typeof process !== "undefined" ? process.env.LEDGER_PUBLIC_URL : undefined;
  const trimmed = raw?.trim().replace(/\/+$/, "") ?? "";
  return /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(trimmed)
    ? trimmed
    : trimmed.replace(/^http:\/\//, "https://");
}

export const Route = createFileRoute("/review")({
  head: () => ({ meta: [{ title: "Leave a review — NXM Nails" }] }),
  loader: () => ({ ledgerBase: ledgerBaseFromEnv() }),
  component: ReviewPage,
});

function ReviewPage() {
  const { ledgerBase } = Route.useLoaderData();
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!author.trim() || !text.trim()) {
      setError("Please add your name and a few words.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${ledgerBase}/api/site/review-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: author.trim(), rating, text: text.trim() }),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setError("Couldn't submit right now. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <p className="text-eyebrow">NXM Nails</p>
          <h1 className="mt-3 text-display text-cream text-[clamp(2rem,6vw,3rem)]">
            {done ? "Thank you 🖤" : "Leave a review"}
          </h1>
        </div>

        {done ? (
          <div className="mt-8 text-center">
            <p className="text-base text-muted-foreground">
              Your review means the world — thank you for taking the time.
            </p>
            <a href="/" className="btn-luxe mt-8 inline-flex">
              Back to site
            </a>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-eyebrow">Your rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star
                      className={`size-8 ${n <= rating ? "fill-bronze-soft text-bronze-soft" : "text-border"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-eyebrow">Your name</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-cream"
                placeholder="First name & last initial"
              />
            </div>
            <div>
              <label className="text-eyebrow">Your review</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-cream"
                placeholder="How were your nails? What did you love?"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button className="btn-luxe" onClick={submit} disabled={busy}>
              {busy ? "Sending…" : "Submit review"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Reviews are posted after a quick check by the studio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
