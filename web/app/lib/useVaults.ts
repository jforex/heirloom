"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;

export type VaultInfo = {
  vaultId: string;
  owner: string;
  name: string;
  heirs: string[];
  lastCheckinMs: number;
  gracePeriodMs: number;
  documentBlobIds: string[];
};

function parseVaultObject(id: string, fields: Record<string, unknown>): VaultInfo {
  return {
    vaultId: id,
    owner: String(fields.owner ?? ""),
    name: String(fields.name ?? ""),
    heirs: Array.isArray(fields.heirs) ? (fields.heirs as string[]) : [],
    lastCheckinMs: Number(fields.last_checkin_ms ?? 0),
    gracePeriodMs: Number(fields.grace_period_ms ?? 0),
    documentBlobIds: Array.isArray(fields.document_blob_ids)
      ? (fields.document_blob_ids as string[])
      : [],
  };
}

// Vaults owned by the current user.
export function useMyVaults() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["myVaults", account?.address],
    enabled: !!account,
    queryFn: async (): Promise<VaultInfo[]> => {
      if (!account) return [];
      const events = await suiClient.queryEvents({
        query: { MoveEventType: `${PACKAGE_ID}::vault::VaultCreated` },
        limit: 200,
        order: "descending",
      });

      const ids = new Set<string>();
      for (const e of events.data) {
        const p = e.parsedJson as { vault_id?: string; owner?: string };
        if (p?.owner === account.address && p.vault_id) ids.add(p.vault_id);
      }
      if (ids.size === 0) return [];

      const out: VaultInfo[] = [];
      for (const id of ids) {
        const obj = await suiClient.getObject({ id, options: { showContent: true } });
        const c = obj.data?.content;
        if (c?.dataType !== "moveObject") continue;
        const f = c.fields as Record<string, unknown>;
        // Confirm still owned by caller (owner could differ if logic changes).
        if (String(f.owner) !== account.address) continue;
        out.push(parseVaultObject(id, f));
      }
      return out;
    },
  });
}

// A single vault by object ID.
export function useVault(vaultId: string) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["vault", vaultId],
    enabled: !!vaultId,
    queryFn: async (): Promise<VaultInfo | null> => {
      const obj = await suiClient.getObject({
        id: vaultId,
        options: { showContent: true },
      });
      const c = obj.data?.content;
      if (c?.dataType !== "moveObject") return null;
      return parseVaultObject(vaultId, c.fields as Record<string, unknown>);
    },
  });
}

// Vaults where the current user is named as an heir ("Vaults I may inherit").
export function useInheritedVaults() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["inheritedVaults", account?.address],
    enabled: !!account,
    queryFn: async (): Promise<VaultInfo[]> => {
      if (!account) return [];
      const events = await suiClient.queryEvents({
        query: { MoveEventType: `${PACKAGE_ID}::vault::HeirAdded` },
        limit: 300,
        order: "descending",
      });

      const ids = new Set<string>();
      for (const e of events.data) {
        const p = e.parsedJson as { vault_id?: string; heir?: string };
        if (p?.heir === account.address && p.vault_id) ids.add(p.vault_id);
      }
      if (ids.size === 0) return [];

      const out: VaultInfo[] = [];
      for (const id of ids) {
        const obj = await suiClient.getObject({ id, options: { showContent: true } });
        const c = obj.data?.content;
        if (c?.dataType !== "moveObject") continue;
        const f = c.fields as Record<string, unknown>;
        const v = parseVaultObject(id, f);
        // Only include if still currently an heir (could have been removed).
        if (!v.heirs.includes(account.address)) continue;
        out.push(v);
      }
      return out;
    },
  });
}
