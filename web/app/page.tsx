"use client";

import Link from "next/link";
import { Logo } from "./components/Logo";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo size={30} />
          <div className="flex items-center gap-6 text-base">
            
            <a
              href="#how"
              className="hidden text-[var(--muted)] transition hover:text-[var(--foreground)] sm:block"
            >
              How it works
            </a>
            
            <a
              href="#trust"
              className="hidden text-[var(--muted)] transition hover:text-[var(--foreground)] sm:block"
            >
              Why trust it
            </a>
            <Link
              href="/app"
              className="rounded-md bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
            >
              Launch app
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-10rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-amber-500/[0.08] blur-[140px]"
        />
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="mb-7 inline-block rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Encrypted continuity vault · on Sui
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Pass on what matters,
            <br />
            <span className="text-amber-400">only if you go silent.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[var(--foreground)]/85">
            Encrypt your sensitive files, recovery phrases, and final
            instructions. The people you choose can unlock them — but only
            after you stop checking in. No lawyer, no company, enforced
            on-chain.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="rounded-lg bg-amber-500 px-7 py-3.5 text-base font-semibold text-black transition hover:bg-amber-400"
            >
              Create your vault
            </Link>
            
            <a
              href="#how"
              className="rounded-lg border border-[var(--border-strong)] px-7 py-3.5 text-base font-medium text-[var(--foreground)] transition hover:border-amber-700/50"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* What's at stake */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="font-serif text-4xl tracking-tight">
            What would your family struggle to find?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--foreground)]/80">
            Wallet recovery phrases. Account access. Insurance and legal
            documents. Business continuity plans. The letter you always meant
            to write. Today these live in places no one else can reach — and
            when you&apos;re unreachable, so are they.
          </p>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2.5">
            {[
              "Recovery phrases",
              "Account access",
              "Legal documents",
              "Final instructions",
              "Business continuity",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-1.5 text-sm text-[var(--foreground)]/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-center font-serif text-4xl tracking-tight">
            How Heirloom works
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-4">
            {[
              {
                n: "01",
                t: "Create a vault",
                d: "Encrypt files and secrets in your browser. Stored on Walrus — unreadable to anyone, including us.",
              },
              {
                n: "02",
                t: "Name your heirs",
                d: "Choose who inherits access. They never see the contents until the conditions are met.",
              },
              {
                n: "03",
                t: "Check in",
                d: "A simple heartbeat proves you're still here. Traveling? Extend the window anytime.",
              },
              {
                n: "04",
                t: "Released on silence",
                d: "Stop checking in past your grace period, and your heirs — only then — can decrypt.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-amber-700/40"
              >
                <span className="font-mono text-sm font-semibold text-amber-400">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/75">
                  {s.d}
                </p>
              </div>
            ))}
          </div>

          {/* State timeline */}
          <div className="mt-20">
            <p className="mb-7 text-center text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              The lifecycle of a vault
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <div className="flex-1 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-6 text-center">
                <p className="text-base font-semibold text-emerald-300">
                  Active
                </p>
                <p className="mt-1.5 text-sm text-[var(--foreground)]/70">
                  You check in. Vault stays sealed.
                </p>
              </div>
              <span className="text-center text-[var(--muted-2)]">→</span>
              <div className="flex-1 rounded-xl border border-amber-900/50 bg-amber-950/20 p-6 text-center">
                <p className="text-base font-semibold text-amber-300">Silent</p>
                <p className="mt-1.5 text-sm text-[var(--foreground)]/70">
                  Grace period counts down.
                </p>
              </div>
              <span className="text-center text-[var(--muted-2)]">→</span>
              <div className="flex-1 rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center">
                <p className="text-base font-semibold text-red-300">Released</p>
                <p className="mt-1.5 text-sm text-[var(--foreground)]/70">
                  Heirs can decrypt. Check in to re-seal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="border-t border-[var(--border)] bg-[var(--surface)]/40">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-center font-serif text-4xl tracking-tight">
            Why you can trust it
          </h2>
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                t: "No middleman",
                d: "The release rule lives in a smart contract on Sui. No company can withhold, alter, or override your wishes — not even us.",
              },
              {
                t: "Truly encrypted",
                d: "Files are encrypted with Seal before they leave your device. Decryption keys are gated by on-chain logic.",
              },
              {
                t: "Released only by time",
                d: "Heirs decrypt only after your chosen silence. Check in, and the window resets — they're locked out again.",
              },
            ].map((c) => (
              <div key={c.t}>
                <h3 className="text-lg font-semibold text-amber-400">{c.t}</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]/80">
                  {c.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/app"
              className="rounded-lg bg-amber-500 px-7 py-3.5 text-base font-semibold text-black transition hover:bg-amber-400"
            >
              Create your vault
            </Link>
            <p className="mt-5 text-sm text-[var(--foreground)]/60">
              Sign in with Google or connect a Sui wallet. No seed phrase
              required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-[var(--foreground)]/55 sm:flex-row">
          <span>Heirloom — encrypted legacy on Sui.</span>
          <span>Built with Sui · Walrus · Seal · Enoki</span>
        </div>
      </footer>
    </div>
  );
}
