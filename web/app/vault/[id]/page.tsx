"use client";

import { use } from "react";
import Link from "next/link";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppShell } from "../../components/AppShell";
import { VaultActions } from "../../components/VaultActions";
import { useVault } from "../../lib/useVaults";
import { useCountdown } from "../../lib/useCountdown";
import { shortAddr } from "../../lib/format";
import { DocumentUpload } from "../../components/DocumentUpload";
import { VaultDecryptButton } from "../../components/VaultDecryptButton";

export default function VaultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const account = useCurrentAccount();
  const { data: vault, isLoading, refetch } = useVault(id);

  const cd = useCountdown(
    vault?.lastCheckinMs ?? 0,
    vault?.gracePeriodMs ?? 0,
  );

  if (isLoading) {
    return (
      <AppShell>
        <p className="text-sm text-neutral-500">Loading vault…</p>
      </AppShell>
    );
  }

  if (!vault) {
    return (
      <AppShell>
        <Link href="/" className="text-sm text-amber-500 hover:underline">
          ← Back
        </Link>
        <p className="mt-6 text-sm text-red-400">Vault not found.</p>
      </AppShell>
    );
  }

  const isOwner = !!account && account.address === vault.owner;
  const isHeir = !!account && vault.heirs.includes(account.address);

  return (
    <AppShell>
      <div className="page-enter">
        <Link href="/" className="text-sm text-amber-500 hover:underline">
          ← Back to vaults
        </Link>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{vault.name}</h1>
            <p className="mt-1 text-xs text-neutral-500">
              Owner {shortAddr(vault.owner)}
              {isOwner && <span className="ml-1 text-amber-500">(you)</span>}
              {isHeir && !isOwner && (
                <span className="ml-1 text-sky-400">(you are an heir)</span>
              )}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
              cd.released
                ? "border border-red-900/60 bg-red-950 text-red-400"
                : "border border-emerald-900/60 bg-emerald-950 text-emerald-400"
            }`}
          >
            {cd.released ? "Released" : "Sealed"}
          </span>
        </div>

        {/* Countdown banner */}
        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-center">
          {cd.released ? (
            <>
              <p className="text-xs uppercase tracking-wider text-red-400">
                Released
              </p>
              <p className="mt-2 text-sm text-neutral-300">
                The owner has been silent past the grace period. Heirs can
                decrypt this vault&apos;s documents.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Releases to heirs in
              </p>
              <p className="mt-2 font-mono text-3xl font-bold text-amber-400">
                {cd.remainingMs}
              </p>
              <p className="mt-2 text-xs text-neutral-600">
                …unless the owner checks in first.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Owner controls */}
          {isOwner && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Owner controls
              </h2>
              <VaultActions vault={vault} onChanged={refetch} />
            </div>
          )}

          {/* Documents */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Documents ({vault.documentBlobIds.length})
            </h2>

            {vault.documentBlobIds.length === 0 ? (
              <p className="text-xs text-neutral-600">No documents yet.</p>
            ) : (
              <ul className="space-y-2">
                {vault.documentBlobIds.map((blobId, i) => (
                  <li
                    key={blobId}
                    className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-300">Document {i + 1}</p>
                      <p className="truncate font-mono text-[10px] text-neutral-600">
                        {blobId}
                      </p>
                    </div>
                    {(isOwner || isHeir) && (
                      <div className="ml-3 shrink-0">
                        <VaultDecryptButton
                          blobId={blobId}
                          vaultId={vault.vaultId}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {isOwner && (
              <DocumentUpload vaultId={vault.vaultId} onUploaded={refetch} />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}