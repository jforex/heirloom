"use client";

import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/90 font-mono text-sm font-bold text-black">
              H
            </span>
            <span className="text-lg font-semibold tracking-tight">Heirloom</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-neutral-400 transition hover:text-neutral-100">
              My Vaults
            </Link>
            <Link href="/inherited" className="text-neutral-400 transition hover:text-neutral-100">
              May Inherit
            </Link>
            <Link
              href="/create"
              className="rounded-md bg-neutral-100 px-3 py-1.5 font-medium text-black transition hover:bg-white"
            >
              New Vault
            </Link>
            <ConnectButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
