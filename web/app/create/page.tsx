"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { AppShell } from "../components/AppShell";
import { CLOCK_OBJECT_ID } from "../lib/seal";

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;

// Preset grace periods. Short ones make the dead-man's-switch demoable live.
const PRESETS = [
  { label: "1 minute (demo)", ms: 60_000 },
  { label: "1 hour", ms: 3_600_000 },
  { label: "30 days", ms: 30 * 86_400_000 },
  { label: "90 days", ms: 90 * 86_400_000 },
  { label: "1 year", ms: 365 * 86_400_000 },
];

export default function CreateVaultPage() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const router = useRouter();

  const [name, setName] = useState("");
  const [graceMs, setGraceMs] = useState(PRESETS[0].ms);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCreate() {
    if (!account) return;
    if (!name.trim()) {
      setError("Give your vault a name.");
      return;
    }
    setError(null);
    setBusy(true);

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::vault::create_vault`,
      arguments: [
        tx.pure.string(name.trim()),
        tx.pure.u64(graceMs),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({ digest });
          setBusy(false);
          // Back to dashboard; the new vault will appear shortly.
          router.push("/");
        },
        onError: (err) => {
          setError(err.message);
          setBusy(false);
        },
      },
    );
  }

  return (
    <AppShell>
      <div className="page-enter mx-auto max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight">Create a vault</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Store encrypted documents that release to your heirs only if you stop
          checking in.
        </p>

        {!account ? (
          <p className="mt-8 text-sm text-neutral-500">
            Connect your wallet to create a vault.
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500">
                Vault name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Family documents"
                className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500">
                Grace period
              </label>
              <p className="mt-1 text-xs text-neutral-600">
                How long of silence before your heirs can decrypt. You can change
                this anytime (useful before travel).
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.ms}
                    onClick={() => setGraceMs(p.ms)}
                    className={`rounded-md border px-3 py-1.5 text-xs transition ${
                      graceMs === p.ms
                        ? "border-amber-600 bg-amber-500/10 text-amber-400"
                        : "border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={busy}
              className="w-full rounded-md bg-amber-500 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-amber-400 disabled:opacity-40"
            >
              {busy ? "Creating vault…" : "Create vault"}
            </button>

            <p className="text-center text-xs text-neutral-600">
              You&apos;ll add heirs and documents on the next screen.
            </p>

            {error && (
              <div className="rounded-md border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
