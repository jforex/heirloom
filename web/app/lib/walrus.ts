const PUBLISHER = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER!;
const AGGREGATOR = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR!;

export type WalrusUploadResult = {
  blobId: string;
  alreadyCertified: boolean;
};

export async function uploadToWalrus(
  data: Blob | Uint8Array | ArrayBuffer,
  epochs = 5,
): Promise<WalrusUploadResult> {
  const url = `${PUBLISHER}/v1/blobs?epochs=${epochs}`;

  let body: Blob;
  if (data instanceof Blob) {
    body = data;
  } else if (data instanceof ArrayBuffer) {
    body = new Blob([new Uint8Array(data)]);
  } else {
    body = new Blob([new Uint8Array(data)]);
  }

  const res = await fetch(url, { method: "PUT", body });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Walrus upload failed (${res.status}): ${text || res.statusText}`);
  }

  const json = await res.json();
  if (json.newlyCreated) {
    return { blobId: json.newlyCreated.blobObject.blobId, alreadyCertified: false };
  }
  if (json.alreadyCertified) {
    return { blobId: json.alreadyCertified.blobId, alreadyCertified: true };
  }
  throw new Error("Unexpected Walrus response: " + JSON.stringify(json));
}

export function walrusBlobUrl(blobId: string): string {
  return `${AGGREGATOR}/v1/blobs/${blobId}`;
}

export async function downloadFromWalrus(blobId: string): Promise<Uint8Array> {
  const res = await fetch(walrusBlobUrl(blobId));
  if (!res.ok) {
    throw new Error(`Walrus download failed (${res.status}): ${res.statusText}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}
