"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppShell } from "../components/AppShell";

export default function HeirSetupPage() {
  const account = useCurrentAccount();
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    if (!account) return;
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AppShell>
      <div className="page-enter mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-widest text-amber-400">
          You&apos;ve been named as a heir
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight">
          Get your Heirloom address
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          Someone has prepared a vault for you. To receive access, share your
          Heirloom address with them. They&apos;ll add it to the vault.
        </p>

        {!account ? (
          <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <p className="text-sm text-neutral-300">
              Sign in to generate your address.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Use the Connect button above — sign in with Google for the
              easiest setup. No seed phrase, no crypto knowledge needed.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Your Heirloom address
              </p>
              <p className="mt-2 break-all font-mono text-sm text-neutral-100">
                {account.address}
              </p>
              <button
                onClick={copyAddress}
                className="mt-4 w-full rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                {copied ? "Copied ✓" : "Copy address"}
              </button>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 text-sm leading-relaxed text-neutral-400">
              <p className="font-semibold text-neutral-200">Next steps</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs">
                <li>Send this address to the person who told you about your vault.</li>
                <li>They&apos;ll add it as a heir on their side.</li>
                <li>
                  Come back here anytime — your vault appears under{" "}
                  <span className="text-amber-400">May Inherit</span> once
                  you&apos;re added.
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
