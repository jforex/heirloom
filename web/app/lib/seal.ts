"use client";

import { SealClient, SessionKey, EncryptedObject } from "@mysten/seal";
import { Transaction } from "@mysten/sui/transactions";
import { toHex, fromHex } from "@mysten/sui/utils";

export const SEAL_THRESHOLD = 1;
export const CLOCK_OBJECT_ID = "0x6";

const TESTNET_KEY_SERVERS = [
  "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75",
  "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8",
];

export function makeSealClient(suiClient: unknown): SealClient {
  return new SealClient({
    suiClient: suiClient as never,
    serverConfigs: TESTNET_KEY_SERVERS.map((id) => ({ objectId: id, weight: 1 })),
    verifyKeyServers: false,
  });
}

// Identity = vaultId bytes + random nonce. seal_approve checks the prefix.
export function buildIdentity(vaultId: string): string {
  const vaultBytes = fromHex(vaultId);
  const nonce = crypto.getRandomValues(new Uint8Array(8));
  const full = new Uint8Array(vaultBytes.length + nonce.length);
  full.set(vaultBytes, 0);
  full.set(nonce, vaultBytes.length);
  return toHex(full);
}

export type EncryptResult = {
  encryptedBytes: Uint8Array;
  identityHex: string;
};

export async function sealEncrypt(
  sealClient: SealClient,
  packageId: string,
  vaultId: string,
  data: Uint8Array,
): Promise<EncryptResult> {
  const identityHex = buildIdentity(vaultId);
  const { encryptedObject } = await sealClient.encrypt({
    threshold: SEAL_THRESHOLD,
    packageId,
    id: identityHex,
    data,
  });
  return { encryptedBytes: encryptedObject, identityHex };
}

export function parseIdentity(encryptedBytes: Uint8Array): string {
  return EncryptedObject.parse(encryptedBytes).id;
}

// Heirloom's seal_approve(id, vault, clock, ctx): pass id + vault + clock.
export function buildSealApproveTx(
  packageId: string,
  vaultId: string,
  identityHex: string,
): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::vault::seal_approve`,
    arguments: [
      tx.pure.vector("u8", Array.from(fromHex(identityHex))),
      tx.object(vaultId),
      tx.object(CLOCK_OBJECT_ID),
    ],
  });
  return tx;
}

// Metadata packing so filename + MIME survive the round-trip.
export function packWithMetadata(
  fileBytes: Uint8Array,
  name: string,
  mime: string,
): Uint8Array {
  const header = JSON.stringify({ name, mime });
  const headerBytes = new TextEncoder().encode(header);
  const out = new Uint8Array(4 + headerBytes.length + fileBytes.length);
  out[0] = (headerBytes.length >>> 24) & 0xff;
  out[1] = (headerBytes.length >>> 16) & 0xff;
  out[2] = (headerBytes.length >>> 8) & 0xff;
  out[3] = headerBytes.length & 0xff;
  out.set(headerBytes, 4);
  out.set(fileBytes, 4 + headerBytes.length);
  return out;
}

export type UnpackedFile = { bytes: Uint8Array; name: string; mime: string };

export function unpackWithMetadata(packed: Uint8Array): UnpackedFile {
  const headerLen =
    (packed[0] << 24) | (packed[1] << 16) | (packed[2] << 8) | packed[3];
  const headerBytes = packed.subarray(4, 4 + headerLen);
  const header = JSON.parse(new TextDecoder().decode(headerBytes));
  const bytes = packed.slice(4 + headerLen);
  return {
    bytes,
    name: header.name ?? "document",
    mime: header.mime ?? "application/octet-stream",
  };
}

export { SessionKey };
