"use client";

import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { uploadToWalrus } from "../lib/walrus";
import { makeSealClient, sealEncrypt, packWithMetadata } from "../lib/seal";

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;
const ORIGINAL_PACKAGE_ID = process.env.NEXT_PUBLIC_ORIGINAL_PACKAGE_ID!;

export function DocumentUpload({
  vaultId,
  onUploaded,
}: {
  vaultId: string;
  onUploaded: () => void;
}) {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!account) return null;

  async function handleUpload() {
    if (!file) return;
    setError(null);
    setDone(false);
    setBusy(true);

    try {
      setStatus("Reading file…");
      const rawBytes = new Uint8Array(await file.arrayBuffer());
      const packed = packWithMetadata(
        rawBytes,
        file.name,
        file.type || "application/octet-stream",
      );

      setStatus("Encrypting with Seal…");
      const sealClient = makeSealClient(suiClient);
      const { encryptedBytes } = await sealEncrypt(
        sealClient,
        ORIGINAL_PACKAGE_ID,
        vaultId,
        packed,
      );

      setStatus("Uploading to Walrus…");
      const result = await uploadToWalrus(encryptedBytes, 5);

      setStatus("Anchoring on-chain…");
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::vault::attach_document`,
        arguments: [tx.object(vaultId), tx.pure.string(result.blobId)],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            await suiClient.waitForTransaction({ digest });
            setBusy(false);
            setStatus(null);
            setDone(true);
            setFile(null);
            setTimeout(onUploaded, 1000);
          },
          onError: (err) => {
            setError(err.message);
            setBusy(false);
            setStatus(null);
          },
        },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
      setStatus(null);
    }
  }

  return (
    <div className="space-y-3 border-t border-neutral-800 pt-4">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        Add encrypted document
      </p>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setDone(false);
        }}
        className="block w-full text-xs text-neutral-400 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-xs file:text-neutral-100 hover:file:bg-neutral-700"
      />
      <button
        onClick={handleUpload}
        disabled={!file || busy}
        className="w-full rounded-md bg-amber-500 px-4 py-2 text-xs font-medium text-black transition hover:bg-amber-400 disabled:opacity-40"
      >
        {busy ? status ?? "Working…" : "Encrypt & store"}
      </button>
      {done && (
        <p className="text-xs text-emerald-400">
          Encrypted and stored on Walrus ✓
        </p>
      )}
      {error && (
        <div className="rounded-md border border-red-900/60 bg-red-950/40 p-2.5 text-[11px] text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
