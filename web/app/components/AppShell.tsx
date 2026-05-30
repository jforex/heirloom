"use client";

import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import { Logo } from "./Logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Heirloom home">
            <Logo size={28} />
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/app"
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              My Vaults
            </Link>
            <Link
              href="/inherited"
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              May Inherit
            </Link>
            <Link
              href="/create"
              className="rounded-md bg-[var(--foreground)] px-3 py-1.5 font-medium text-black transition hover:opacity-90"
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
