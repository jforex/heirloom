"use client";

import Link from "next/link";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppShell } from "./components/AppShell";
import { VaultCard } from "./components/VaultCard";
import { useMyVaults } from "./lib/useVaults";

export default function Home() {
  const account = useCurrentAccount();
  const { data: vaults, isLoading } = useMyVaults();

  return (
    <AppShell>
      <div className="page-enter">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">My Vaults</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Encrypted documents that pass to your heirs only if you go silent.
          </p>
        </div>

        {!account ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 text-center">
            <p className="text-sm text-neutral-400">
              Connect your wallet to view and create vaults.
            </p>
          </div>
        ) : isLoading ? (
          <p className="text-sm text-neutral-500">Loading your vaults…</p>
        ) : !vaults || vaults.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 p-10 text-center">
            <p className="text-sm text-neutral-400">You have no vaults yet.</p>
            <Link
              href="/create"
              className="mt-4 inline-block rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400"
            >
              Create your first vault
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {vaults.map((v) => (
              <VaultCard key={v.vaultId} v={v} role="owner" />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
