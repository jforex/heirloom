"use client";

import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 font-mono text-sm font-bold text-black">
              H
            </span>
            <span className="text-lg font-semibold tracking-tight">Heirloom</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <a href="#how" className="hidden text-neutral-400 transition hover:text-neutral-100 sm:block">
              How it works
            </a>
            <a href="#trust" className="hidden text-neutral-400 transition hover:text-neutral-100 sm:block">
              Why trust it
            </a>
            <Link
              href="/app"
              className="rounded-md bg-neutral-100 px-3.5 py-1.5 font-medium text-black transition hover:bg-white"
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
          className="pointer-events-none absolute left-1/2 top-[-10rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]"
        />
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="mb-6 inline-block rounded-full border border-neutral-800 px-3 py-1 text-xs uppercase tracking-widest text-neutral-400">
            Encrypted continuity vault · on Sui
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Pass on what matters,
            <br />
            <span className="text-amber-400">only if you go silent.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-neutral-300">
            Encrypt your sensitive files, recovery phrases, and final
            instructions. The people you choose can unlock them — but only after
            you stop checking in. No lawyer, no company, enforced on-chain.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/app"
              className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              Create your vault
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-neutral-800 px-6 py-3 text-sm font-medium text-neutral-300 transition hover:border-neutral-700"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* What's at stake */}
      <section className="border-t border-neutral-900 bg-neutral-950/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl tracking-tight">
            What would your family struggle to find?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-neutral-300">
            Wallet recovery phrases. Account access. Insurance and legal
            documents. Business continuity plans. The letter you always meant to
            write. Today these live in places no one else can reach — and when
            you&apos;re unreachable, so are they.
          </p>
          <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-2">
            {[
              "Recovery phrases",
              "Account access",
              "Legal documents",
              "Final instructions",
              "Business continuity",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-neutral-800 px-3 py-1 text-xs text-neutral-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-neutral-900">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-serif text-3xl tracking-tight">
            How Heirloom works
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
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
                className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6"
              >
                <span className="font-mono text-xs text-amber-400">{s.n}</span>
                <h3 className="mt-3 text-base font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {s.d}
                </p>
              </div>
            ))}
          </div>

          {/* State timeline */}
          <div className="mt-16">
            <p className="mb-6 text-center text-xs uppercase tracking-widest text-neutral-500">
              The lifecycle of a vault
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <div className="flex-1 rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-5 text-center">
                <p className="text-sm font-semibold text-emerald-400">Active</p>
                <p className="mt-1 text-xs text-neutral-400">
                  You check in. Vault stays sealed.
                </p>
              </div>
              <span className="text-center text-neutral-600">→</span>
              <div className="flex-1 rounded-lg border border-amber-900/60 bg-amber-950/20 p-5 text-center">
                <p className="text-sm font-semibold text-amber-400">Silent</p>
                <p className="mt-1 text-xs text-neutral-400">
                  Grace period counts down.
                </p>
              </div>
              <span className="text-center text-neutral-600">→</span>
              <div className="flex-1 rounded-lg border border-red-900/60 bg-red-950/30 p-5 text-center">
                <p className="text-sm font-semibold text-red-400">Released</p>
                <p className="mt-1 text-xs text-neutral-400">
                  Heirs can decrypt. Check in to re-seal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="border-t border-neutral-900 bg-neutral-950/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-serif text-3xl tracking-tight">
            Why you can trust it
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
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
                <h3 className="text-base font-semibold text-amber-400">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {c.d}
                </p>
              </div>
            ))}
          </div>

          {/* Powered by */}
          <div className="mt-16 border-t border-neutral-900 pt-10">
            <p className="text-center text-xs uppercase tracking-widest text-neutral-500">
              Powered by
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
              {[
                ["Sui", "Smart contracts"],
                ["Walrus", "Decentralized storage"],
                ["Seal", "Threshold encryption"],
                ["zkLogin", "Seedless onboarding"],
              ].map(([name, desc]) => (
                <div key={name} className="text-center">
                  <p className="font-semibold text-neutral-200">{name}</p>
                  <p className="text-xs text-neutral-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/app"
              className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              Create your vault
            </Link>
            <p className="mt-4 text-xs text-neutral-600">
              Sign in with Google or connect a Sui wallet. No seed phrase required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-neutral-600 sm:flex-row">
          <span>Heirloom — encrypted legacy on Sui.</span>
          <span>Built with Sui · Walrus · Seal · Enoki</span>
        </div>
      </footer>
    </div>
  );
}
