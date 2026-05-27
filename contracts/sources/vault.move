/// Heirloom: a decentralized dead-man's-switch vault.
///
/// A creator stores encrypted documents (on Walrus) in a Vault and names
/// heirs. The creator must periodically `check_in`. If they go silent past
/// the grace period, heirs become able to decrypt — enforced entirely
/// on-chain via Seal's `seal_approve`, with no server or third party.
///
/// Time comes from the shared Clock object at 0x6 (sui::clock).
module heirloom::vault;

use std::string::String;
use sui::clock::Clock;
use sui::event;

// ===== Errors =====
const ENotOwner: u64 = 0;
const ENoAccess: u64 = 1;
const EAlreadyHeir: u64 = 2;
const ENotHeir: u64 = 3;

// ===== Object =====

/// A vault is a shared object so Seal key servers and heirs can read it.
public struct Vault has key {
    id: UID,
    owner: address,
    /// Human label, e.g. "Family documents".
    name: String,
    /// Addresses that may decrypt AFTER the grace period of owner silence.
    heirs: vector<address>,
    /// Last time the owner proved liveness (ms since epoch).
    last_checkin_ms: u64,
    /// Required silence before heirs unlock (ms).
    grace_period_ms: u64,
    /// Walrus blob IDs of encrypted documents.
    document_blob_ids: vector<String>,
}

// ===== Events =====

public struct VaultCreated has copy, drop {
    vault_id: ID,
    owner: address,
    name: String,
    grace_period_ms: u64,
}

public struct CheckedIn has copy, drop {
    vault_id: ID,
    at_ms: u64,
}

public struct GracePeriodChanged has copy, drop {
    vault_id: ID,
    new_grace_period_ms: u64,
}

public struct HeirAdded has copy, drop {
    vault_id: ID,
    heir: address,
}

public struct HeirRemoved has copy, drop {
    vault_id: ID,
    heir: address,
}

public struct DocumentAttached has copy, drop {
    vault_id: ID,
    blob_id: String,
}

// ===== Create =====

/// Create a vault. Caller becomes owner; check-in clock starts now.
public fun create_vault(
    name: String,
    grace_period_ms: u64,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let owner = ctx.sender();
    let now = clock.timestamp_ms();
    let vault = Vault {
        id: object::new(ctx),
        owner,
        name,
        heirs: vector[],
        last_checkin_ms: now,
        grace_period_ms,
        document_blob_ids: vector[],
    };

    event::emit(VaultCreated {
        vault_id: object::id(&vault),
        owner,
        name: vault.name,
        grace_period_ms,
    });

    transfer::share_object(vault);
}

// ===== Owner actions =====

/// Heartbeat: proves the owner is alive, resets the timer.
public fun check_in(vault: &mut Vault, clock: &Clock, ctx: &TxContext) {
    assert!(ctx.sender() == vault.owner, ENotOwner);
    vault.last_checkin_ms = clock.timestamp_ms();
    event::emit(CheckedIn {
        vault_id: object::id(vault),
        at_ms: vault.last_checkin_ms,
    });
}

/// Adjust the grace period (e.g. before long travel). Also counts as a
/// check-in, since actively managing the vault proves liveness.
public fun set_grace_period(
    vault: &mut Vault,
    new_grace_period_ms: u64,
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(ctx.sender() == vault.owner, ENotOwner);
    vault.grace_period_ms = new_grace_period_ms;
    vault.last_checkin_ms = clock.timestamp_ms();
    event::emit(GracePeriodChanged {
        vault_id: object::id(vault),
        new_grace_period_ms,
    });
}

public fun add_heir(vault: &mut Vault, heir: address, ctx: &TxContext) {
    assert!(ctx.sender() == vault.owner, ENotOwner);
    assert!(!vault.heirs.contains(&heir), EAlreadyHeir);
    vault.heirs.push_back(heir);
    event::emit(HeirAdded { vault_id: object::id(vault), heir });
}

public fun remove_heir(vault: &mut Vault, heir: address, ctx: &TxContext) {
    assert!(ctx.sender() == vault.owner, ENotOwner);
    let (found, idx) = vault.heirs.index_of(&heir);
    assert!(found, ENotHeir);
    vault.heirs.remove(idx);
    event::emit(HeirRemoved { vault_id: object::id(vault), heir });
}

public fun attach_document(
    vault: &mut Vault,
    blob_id: String,
    ctx: &TxContext,
) {
    assert!(ctx.sender() == vault.owner, ENotOwner);
    vault.document_blob_ids.push_back(blob_id);
    event::emit(DocumentAttached { vault_id: object::id(vault), blob_id });
}

// ===== Seal access policy =====

/// The heart of Heirloom. Seal key servers dry-run this during decryption.
/// Approves if:
///   - the id is namespaced under this vault, AND
///   - the caller is the OWNER (always), OR
///   - the caller is a HEIR and the owner has been silent past the grace period.
entry fun seal_approve(
    id: vector<u8>,
    vault: &Vault,
    clock: &Clock,
    ctx: &TxContext,
) {
    let vault_id_bytes = object::id(vault).to_bytes();
    assert!(is_prefix(&vault_id_bytes, &id), ENoAccess);

    let caller = ctx.sender();
    if (caller == vault.owner) {
        return
    };

    // Heir path: must be a heir AND past the release threshold.
    assert!(vault.heirs.contains(&caller), ENoAccess);
    let now = clock.timestamp_ms();
    let release_at = vault.last_checkin_ms + vault.grace_period_ms;
    assert!(now > release_at, ENoAccess);
}

fun is_prefix(prefix: &vector<u8>, full: &vector<u8>): bool {
    let plen = prefix.length();
    if (plen > full.length()) return false;
    let mut i = 0;
    while (i < plen) {
        if (prefix[i] != full[i]) return false;
        i = i + 1;
    };
    true
}

// ===== Views =====

public fun owner(v: &Vault): address { v.owner }
public fun heirs(v: &Vault): vector<address> { v.heirs }
public fun last_checkin_ms(v: &Vault): u64 { v.last_checkin_ms }
public fun grace_period_ms(v: &Vault): u64 { v.grace_period_ms }
public fun document_count(v: &Vault): u64 { v.document_blob_ids.length() }

/// True if heirs can currently decrypt (owner silent past grace).
public fun is_released(v: &Vault, clock: &Clock): bool {
    clock.timestamp_ms() > v.last_checkin_ms + v.grace_period_ms
}
