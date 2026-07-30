import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Clock,
  Star,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import g7 from "@/assets/g7.jpg";
import g8 from "@/assets/g8.jpg";

// --- Photos managed from the ledger app (falls back to the bundled images) ---
type ManifestImage = { url: string; tag: string | null; alt: string | null };
type SiteManifest = { hero: ManifestImage | null; about: ManifestImage | null; gallery: ManifestImage[] };

async function loadManifest(): Promise<SiteManifest | null> {
  const raw = typeof process !== "undefined" ? process.env.LEDGER_PUBLIC_URL : undefined;
  const base = raw?.replace(/\/$/, "");
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/site/manifest`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const m = (await res.json()) as SiteManifest;
    const abs = (i: ManifestImage | null) =>
      i ? { ...i, url: i.url.startsWith("http") ? i.url : `${base}${i.url}` } : null;
    return { hero: abs(m.hero), about: abs(m.about), gallery: (m.gallery ?? []).map((g) => abs(g)!) };
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NXM Nails — Custom Nail Artistry by Mia" },
      {
        name: "description",
        content:
          "NXM Nails is a luxury nail studio specializing in gel, acrylic, chrome, matte, and custom nail art. Book an appointment for editorial-grade craftsmanship.",
      },
      { name: "keywords", content: "NXM Nails, custom nail artistry, nail salon, acrylic nails, gel nails, chrome nails, nail artist, custom nail art" },
      { property: "og:title", content: "NXM Nails — Custom Nail Artistry by Mia" },
      { property: "og:description", content: "Custom nail artistry designed for those who love bold beauty and flawless detail." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "NXM Nails — Custom Nail Artistry by Mia" },
      { name: "twitter:description", content: "Custom nail artistry for bold beauty and flawless detail." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: "NXM Nails",
          image: "/favicon.ico",
          description: "Luxury nail studio specializing in custom nail artistry.",
          priceRange: "$$$",
          telephone: "+1-555-000-0000",
          address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
          openingHours: ["Tu-Fr 10:00-19:00", "Sa 10:00-18:00"],
          sameAs: ["https://instagram.com/nxmnails"],
        }),
      },
    ],
  }),
  loader: () => loadManifest(),
  component: Home,
});

const FILTERS = ["All", "Gel", "Acrylic", "Nail Art", "French", "Seasonal", "Chrome", "Matte"] as const;

type Filter = (typeof FILTERS)[number];

const GALLERY: { src: string; tag: Exclude<Filter, "All">; alt: string; span?: string }[] = [
  { src: g1, tag: "Acrylic", alt: "Long glossy black almond acrylic nails", span: "row-span-2" },
  { src: g2, tag: "Chrome", alt: "Bronze chrome mirror nails" },
  { src: g4, tag: "Nail Art", alt: "Matte black nails with hand painted gold foil art", span: "row-span-2" },
  { src: g3, tag: "French", alt: "Reverse French tip nails in black and cream" },
  { src: g6, tag: "Matte", alt: "Matte espresso brown almond nails" },
  { src: g5, tag: "Acrylic", alt: "Long stiletto oxblood acrylic nails", span: "row-span-2" },
  { src: g7, tag: "Chrome", alt: "Silver chrome mirror stiletto nails" },
  { src: g8, tag: "Seasonal", alt: "Seasonal winter nail art with crystal snowflakes" },
];

const SERVICES = [
  { name: "Full Sets", desc: "Custom-sculpted tips shaped to your hand. Any length, any finish.", price: "$85", featured: true },
  { name: "Fills", desc: "Regrowth reshaped and refined. Keep your set flawless.", price: "$55" },
  { name: "Nail Art", desc: "Hand-painted detail, foils, chrome, freehand — priced per nail.", price: "$8" },
  { name: "Gel Manicure", desc: "Cuticle care, shape, and long-wear gel color on natural nails.", price: "$45" },
  { name: "Acrylic", desc: "Signature durability and definition. Sculpted to editorial standards.", price: "$75" },
  { name: "Removal", desc: "Gentle soak-off with full nail-health restoration protocol.", price: "$25" },
  { name: "Repair", desc: "Per-nail repair for chips, breaks, and lifts. Restored in minutes.", price: "$10" },
];

const TESTIMONIALS = [
  { name: "Amara J.", text: "The most detailed set I have ever had. It feels like couture on my hands.", role: "Client since 2022" },
  { name: "Simone R.", text: "The studio is a mood. Every visit feels like a private appointment at a fashion house.", role: "Editor, Vogue Adjacent" },
  { name: "Maya L.", text: "Chrome work is unmatched. People stop me on the street to ask who did them.", role: "Stylist" },
  { name: "Kai N.", text: "Clean, calm, and precise. NXM sets the bar for what a nail studio should feel like.", role: "Photographer" },
];

const FAQ = [
  { q: "Is a deposit required?", a: "Yes — a non-refundable $25 deposit secures your appointment and is applied toward your service." },
  { q: "What is your cancellation policy?", a: "Please reschedule at least 48 hours in advance. Late cancellations forfeit the deposit." },
  { q: "How long does a full set take?", a: "Full sets take 2 to 3 hours depending on shape, length, and art. Please plan accordingly." },
  { q: "Do you accept walk-ins?", a: "NXM is by appointment only to ensure every client receives full, unhurried attention." },
];

function Home() {
  const [filter, setFilter] = useState<Filter>("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [testimonial, setTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTestimonial((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);

  const manifest = Route.useLoaderData();
  const heroSrc = manifest?.hero?.url ?? hero;
  const aboutSrc = manifest?.about?.url ?? about;

  const galleryItems = useMemo<{ src: string; tag: string; alt: string }[]>(() => {
    if (manifest?.gallery?.length) {
      return manifest.gallery.map((g) => ({ src: g.url, tag: g.tag ?? "All", alt: g.alt ?? "" }));
    }
    return GALLERY;
  }, [manifest]);

  const igStrip = useMemo(
    () => (manifest?.gallery?.length ? manifest.gallery.map((g) => g.url) : [g2, g6, g7, g3, g4, g1, g8, g5]),
    [manifest],
  );

  const gallery = useMemo(
    () => (filter === "All" ? galleryItems : galleryItems.filter((g) => g.tag === filter)),
    [filter, galleryItems],
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-panel py-3" : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="text-2xl tracking-[0.28em] text-cream" style={{ fontFamily: "var(--font-serif)" }}>
              NXM
            </span>
            <span className="text-eyebrow hidden sm:inline">Nails by Mia</span>
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            {[
              ["Work", "#work"],
              ["About", "#about"],
              ["Services", "#services"],
              ["Journal", "#instagram"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-bronze-soft"
              >
                {label}
              </a>
            ))}
          </nav>
          <a href="#booking" className="hidden md:inline-flex btn-luxe !py-3 !px-6 !min-h-0 text-[0.7rem]">
            Book
          </a>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-cream md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="mt-3 border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
              {[
                ["Work", "#work"],
                ["About", "#about"],
                ["Services", "#services"],
                ["Journal", "#instagram"],
                ["FAQ", "#faq"],
                ["Book", "#booking"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm uppercase tracking-[0.28em] text-cream/90"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={heroSrc}
          alt={manifest?.hero?.alt ?? "Elegant hand with luxury dark nails"}
          width={1600}
          height={1800}
          className="absolute inset-0 h-full w-full object-cover object-center animate-fade-in"
          style={{ filter: "contrast(1.05) saturate(0.9)" }}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(138,106,77,0.18),transparent_60%)]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-24 pt-40 md:px-10 md:pb-32">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-eyebrow">NXM Nails — Nails by Mia</p>
            <h1 className="mt-6 text-display text-cream text-[clamp(2.6rem,8vw,5.75rem)]">
              Art From
              <br />
              <em className="not-italic bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-bronze)" }}>
                The Heart.
              </em>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Custom nail artistry designed for those who love bold beauty, timeless
              style, and flawless detail.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#booking" className="btn-luxe">
                <Calendar className="size-4" /> Book appointment
              </a>
              <a href="#work" className="btn-ghost">
                View portfolio <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <a
            href="#work"
            aria-label="Scroll to work"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-bronze-soft animate-float"
          >
            <ChevronDown className="size-6" />
          </a>
        </div>
      </section>

      {/* MARQUEE / VALUE STRIP */}
      <section className="border-y border-border/60 bg-surface/40 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 md:px-10">
          {["Editorial detail", "Premium products", "Sanitized studio", "By appointment only", "Custom art"].map((t) => (
            <span key={t} className="text-eyebrow text-muted-foreground">
              — {t}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section id="work" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-eyebrow">Featured Work</p>
              <h2 className="mt-4 text-display text-cream text-[clamp(2rem,5vw,3.5rem)]">
                A private archive of<br className="hidden sm:block" /> quiet obsessions.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Every set is documented under studio light. Filter the archive by
              technique or finish.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`min-h-9 rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] transition-all ${
                  filter === f
                    ? "border-transparent bg-cream text-background"
                    : "border-border text-muted-foreground hover:border-bronze hover:text-bronze-soft"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Masonry */}
          <div className="mt-10 columns-2 gap-4 md:columns-3 md:gap-6 lg:columns-4">
            {gallery.map((item, i) => (
              <figure
                key={item.src + i}
                className="group relative mb-4 md:mb-6 break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 items-center justify-between p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-eyebrow text-cream">{item.tag}</span>
                  <ArrowUpRight className="size-4 text-bronze-soft" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative bg-surface/40 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-10 lg:gap-24">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <img
                src={aboutSrc}
                alt={manifest?.about?.alt ?? "Portrait of the NXM Nails founder in the studio"}
                width={1200}
                height={1500}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-xl border border-border bg-background/80 p-5 backdrop-blur-md md:block">
              <p className="text-eyebrow">Since 2019</p>
              <p className="mt-2 text-2xl text-cream" style={{ fontFamily: "var(--font-serif)" }}>
                6,400+ sets crafted
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-eyebrow">The Artist</p>
            <h2 className="mt-4 text-display text-cream text-[clamp(2rem,5vw,3.5rem)]">
              Precision meets<br />
              <em className="not-italic text-bronze-soft">devotion.</em>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              NXM is a private studio built around obsessive attention to detail and
              a strict standard of quality. Every appointment is one-to-one, unhurried,
              and calibrated to your hand — never a template, never a rush.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We work with premium, low-tox systems and maintain a hospital-grade
              sanitation protocol. What you get is craftsmanship you can feel,
              a finish you can see, and a space that feels entirely yours for the hour.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8">
              {[
                ["7 yrs", "In practice"],
                ["1:1", "Client capacity"],
                ["4.9★", "300+ reviews"],
                ["100%", "Sterile tools"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-2xl text-cream" style={{ fontFamily: "var(--font-serif)" }}>
                    {n}
                  </dt>
                  <dd className="text-eyebrow mt-1 text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-eyebrow">The Menu</p>
              <h2 className="mt-4 text-display text-cream text-[clamp(2rem,5vw,3.5rem)]">
                Services & pricing.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Starting prices. Final quote depends on length, shape, and art. All
              services include cuticle care and finish.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <article
                key={s.name}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1 ${
                  s.featured
                    ? "border-bronze/40 bg-gradient-to-br from-espresso/40 to-surface"
                    : "border-border bg-surface hover:border-bronze/40"
                }`}
              >
                <div className="absolute inset-x-0 -top-px h-px" style={{ background: "linear-gradient(90deg, transparent, var(--bronze), transparent)" }} />
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl text-cream" style={{ fontFamily: "var(--font-serif)" }}>
                      {s.name}
                    </h3>
                    {s.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-bronze/40 px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-bronze-soft">
                        <Sparkles className="size-3" /> Signature
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-border pt-6">
                  <div>
                    <p className="text-eyebrow">From</p>
                    <p className="mt-1 text-2xl text-cream" style={{ fontFamily: "var(--font-serif)" }}>
                      {s.price}
                    </p>
                  </div>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.24em] text-bronze-soft transition-transform group-hover:translate-x-1"
                  >
                    Book <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative overflow-hidden bg-surface/40 py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
          <p className="text-eyebrow">Praise</p>
          <h2 className="mt-4 text-display text-cream text-[clamp(2rem,5vw,3.25rem)]">
            Words from the studio.
          </h2>

          <div className="relative mt-12 min-h-[16rem] md:min-h-[14rem]">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={t.name}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                  i === testimonial ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                <div className="flex gap-1 text-bronze-soft">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-cream md:text-2xl" style={{ fontFamily: "var(--font-serif)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="mt-6">
                  <p className="text-sm text-cream">{t.name}</p>
                  <p className="text-eyebrow mt-1 text-muted-foreground">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonial(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === testimonial ? "w-8 bg-bronze" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section id="instagram" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-eyebrow">The Feed</p>
              <h2 className="mt-4 text-display text-cream text-[clamp(2rem,5vw,3.25rem)]">
                Latest from the studio.
              </h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <Instagram className="size-4" /> Follow @nxmnails
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {igStrip.map((src, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-lg border border-border"
              >
                <img
                  src={src}
                  alt="Instagram post"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 grid place-items-center bg-background/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Instagram className="size-6 text-bronze-soft" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="relative overflow-hidden py-24 md:py-40">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(138,106,77,0.35), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
          <p className="text-eyebrow">Booking</p>
          <h2 className="mt-4 text-display text-cream text-[clamp(2.4rem,7vw,4.5rem)]">
            Reserve your <em className="not-italic text-bronze-soft">appointment.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            A $25 deposit is required to secure your slot and is applied to your
            service. Please arrive with clean, product-free nails.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#" className="btn-luxe">
              <Calendar className="size-4" /> Reserve now
            </a>
            <a href="tel:+15550000000" className="btn-ghost">
              <Phone className="size-4" /> Call the studio
            </a>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3 text-left">
            {[
              ["Deposit", "$25 non-refundable, applied to your service."],
              ["Cancellations", "Reschedule 48h in advance to preserve deposit."],
              ["Late arrivals", "15+ minutes may require rescheduling."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-xl border border-border bg-surface/60 p-5">
                <p className="text-eyebrow">{h}</p>
                <p className="mt-3 text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-surface/30 py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <p className="text-eyebrow text-center">Questions</p>
          <h2 className="mt-4 text-center text-display text-cream text-[clamp(2rem,5vw,3rem)]">
            Everything, before you book.
          </h2>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={open}
                  >
                    <span className="text-lg text-cream md:text-xl" style={{ fontFamily: "var(--font-serif)" }}>
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-bronze-soft transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden transition-all duration-500 ${
                      open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-60"
                    }`}
                  >
                    <p className="min-h-0 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border bg-background py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-4 md:px-10">
          <div className="md:col-span-2">
            <p className="text-serif text-3xl tracking-[0.28em] text-cream" style={{ fontFamily: "var(--font-serif)" }}>
              NXM
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A private luxury nail studio. By appointment only. Custom artistry,
              editorial finish, one client at a time.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                [Instagram, "https://instagram.com", "Instagram"],
                [Facebook, "https://facebook.com", "Facebook"],
                [Mail, "mailto:hello@nxmnails.com", "Email"],
                [Phone, "tel:+15550000000", "Phone"],
              ].map(([Icon, href, label]) => {
                const I = Icon as typeof Instagram;
                return (
                  <a
                    key={label as string}
                    href={href as string}
                    aria-label={label as string}
                    className="grid size-11 place-items-center rounded-full border border-border text-cream transition-colors hover:border-bronze hover:text-bronze-soft"
                  >
                    <I className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-eyebrow">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="size-4 text-bronze-soft" /> hello@nxmnails.com</li>
              <li className="flex items-center gap-2"><Phone className="size-4 text-bronze-soft" /> (555) 000-0000</li>
            </ul>
          </div>

          <div>
            <p className="text-eyebrow">Studio hours</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Clock className="size-4 text-bronze-soft" /> Tue – Fri · 10 – 7</li>
              <li className="flex items-center gap-2"><Clock className="size-4 text-bronze-soft" /> Sat · 10 – 6</li>
              <li className="flex items-center gap-2"><Clock className="size-4 text-bronze-soft" /> Sun · Closed</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border px-5 pt-8 text-xs text-muted-foreground md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} NXM Nails. All rights reserved.</p>
          <p className="text-eyebrow">Crafted in the dark.</p>
        </div>
      </footer>

      {/* Sticky mobile book button */}
      <a
        href="#booking"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-background/80 px-5 py-3 text-[0.72rem] uppercase tracking-[0.22em] text-cream shadow-luxe backdrop-blur-xl md:hidden"
      >
        <Calendar className="size-4 text-bronze-soft" /> Book now
      </a>
    </div>
  );
}
