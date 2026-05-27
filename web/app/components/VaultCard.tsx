"use client";

import Link from "next/link";
import { VaultInfo } from "../lib/useVaults";
import { formatGrace } from "../lib/format";
import { useCountdown } from "../lib/useCountdown";

export function VaultCard({ v, role }: { v: VaultInfo; role: "owner" | "heir" }) {
  const { releaseAtMs, released, remainingMs } = useCountdown(
    v.lastCheckinMs,
    v.gracePeriodMs,
  );

  return (
    <Link
      href={`/vault/${v.vaultId}`}
      className="block rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 transition hover:border-neutral-700 hover:bg-neutral-900/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{v.name || "Untitled vault"}</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {v.documentBlobIds.length} document
            {v.documentBlobIds.length === 1 ? "" : "s"} · {v.heirs.length} heir
            {v.heirs.length === 1 ? "" : "s"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
            released
              ? "bg-red-950 text-red-400 border border-red-900/60"
              : "bg-emerald-950 text-emerald-400 border border-emerald-900/60"
          }`}
        >
          {released ? "Released" : "Sealed"}
        </span>
      </div>

      <div className="mt-4 border-t border-neutral-800 pt-3">
        {role === "owner" ? (
          released ? (
            <p className="text-xs text-red-400">
              Heirs can now decrypt — check in to re-seal.
            </p>
          ) : (
            <p className="text-xs text-neutral-400">
              Releases in <span className="font-mono text-neutral-200">{remainingMs}</span> unless you check in
            </p>
          )
        ) : released ? (
          <p className="text-xs text-emerald-400">Available to claim now</p>
        ) : (
          <p className="text-xs text-neutral-400">
            Locked — owner active. Grace: {formatGrace(v.gracePeriodMs)}
          </p>
        )}
      </div>
    </Link>
  );
}
