"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppShell } from "../components/AppShell";
import { VaultCard } from "../components/VaultCard";
import { useInheritedVaults } from "../lib/useVaults";

export default function InheritedPage() {
  const account = useCurrentAccount();
  const { data: vaults, isLoading } = useInheritedVaults();

  return (
    <AppShell>
      <div className="page-enter">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Vaults I may inherit</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Vaults where you&apos;re named as an heir. You can decrypt their
            documents once the owner goes silent past the grace period.
          </p>
        </div>

        {!account ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 text-center">
            <p className="text-sm text-neutral-400">
              Connect your wallet to see vaults you may inherit.
            </p>
          </div>
        ) : isLoading ? (
          <p className="text-sm text-neutral-500">Checking…</p>
        ) : !vaults || vaults.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 p-10 text-center">
            <p className="text-sm text-neutral-400">
              You&apos;re not named as an heir in any vaults yet.
            </p>
            <p className="mt-2 text-xs text-neutral-600">
              When someone names your address as an heir, their vault appears here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {vaults.map((v) => (
              <VaultCard key={v.vaultId} v={v} role="heir" />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
