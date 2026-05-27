"use client";

import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { VaultInfo } from "../lib/useVaults";
import { CLOCK_OBJECT_ID } from "../lib/seal";
import { shortAddr, formatGrace } from "../lib/format";

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;

const GRACE_PRESETS = [
  { label: "1 min", ms: 60_000 },
  { label: "1 hr", ms: 3_600_000 },
  { label: "30 days", ms: 30 * 86_400_000 },
  { label: "90 days", ms: 90 * 86_400_000 },
  { label: "1 year", ms: 365 * 86_400_000 },
];

export function VaultActions({
  vault,
  onChanged,
}: {
  vault: VaultInfo;
  onChanged: () => void;
}) {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [heirAddr, setHeirAddr] = useState("");

  const isOwner = !!account && account.address === vault.owner;
  if (!isOwner) return null;

  function run(label: string, build: (tx: Transaction) => void) {
    setError(null);
    setBusy(label);
    const tx = new Transaction();
    build(tx);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({ digest });
          setBusy(null);
          setTimeout(onChanged, 1000);
        },
        onError: (err) => {
          setError(err.message);
          setBusy(null);
        },
      },
    );
  }

  function checkIn() {
    run("checkin", (tx) => {
      tx.moveCall({
        target: `${PACKAGE_ID}::vault::check_in`,
        arguments: [tx.object(vault.vaultId), tx.object(CLOCK_OBJECT_ID)],
      });
    });
  }

  function setGrace(ms: number) {
    run("grace", (tx) => {
      tx.moveCall({
        target: `${PACKAGE_ID}::vault::set_grace_period`,
        arguments: [
          tx.object(vault.vaultId),
          tx.pure.u64(ms),
          tx.object(CLOCK_OBJECT_ID),
        ],
      });
    });
  }

  function addHeir() {
    const addr = heirAddr.trim();
    if (!addr.startsWith("0x") || addr.length < 10) {
      setError("Enter a valid Sui address (0x…).");
      return;
    }
    run("addheir", (tx) => {
      tx.moveCall({
        target: `${PACKAGE_ID}::vault::add_heir`,
        arguments: [tx.object(vault.vaultId), tx.pure.address(addr)],
      });
    });
    setHeirAddr("");
  }

  function removeHeir(addr: string) {
    run("removeheir-" + addr, (tx) => {
      tx.moveCall({
        target: `${PACKAGE_ID}::vault::remove_heir`,
        arguments: [tx.object(vault.vaultId), tx.pure.address(addr)],
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Check in */}
      <div>
        <button
          onClick={checkIn}
          disabled={busy === "checkin"}
          className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-40"
        >
          {busy === "checkin" ? "Checking in…" : "✓ Check in (I'm here)"}
        </button>
        <p className="mt-2 text-center text-xs text-neutral-600">
          Resets the timer. Do this regularly to keep the vault sealed.
        </p>
      </div>

      {/* Grace period */}
      <div className="border-t border-neutral-800 pt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Grace period — currently {formatGrace(vault.gracePeriodMs)}
        </p>
        <p className="mt-1 text-xs text-neutral-600">
          Going away? Extend it (this also checks you in).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GRACE_PRESETS.map((p) => (
            <button
              key={p.ms}
              onClick={() => setGrace(p.ms)}
              disabled={busy === "grace"}
              className={`rounded-md border px-3 py-1.5 text-xs transition disabled:opacity-40 ${
                vault.gracePeriodMs === p.ms
                  ? "border-amber-600 bg-amber-500/10 text-amber-400"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heirs */}
      <div className="border-t border-neutral-800 pt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Heirs ({vault.heirs.length})
        </p>
        <ul className="mt-3 space-y-1.5">
          {vault.heirs.length === 0 ? (
            <li className="text-xs text-neutral-600">
              No heirs yet. Add one below.
            </li>
          ) : (
            vault.heirs.map((h) => (
              <li
                key={h}
                className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs"
              >
                <span className="font-mono text-neutral-300">{shortAddr(h)}</span>
                <button
                  onClick={() => removeHeir(h)}
                  disabled={!!busy}
                  className="text-neutral-500 transition hover:text-red-400 disabled:opacity-40"
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={heirAddr}
            onChange={(e) => setHeirAddr(e.target.value)}
            placeholder="0x… heir address"
            className="flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
          <button
            onClick={addHeir}
            disabled={busy === "addheir" || !heirAddr}
            className="rounded-md bg-amber-500 px-3 py-2 text-xs font-medium text-black transition hover:bg-amber-400 disabled:opacity-40"
          >
            {busy === "addheir" ? "Adding…" : "Add heir"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
