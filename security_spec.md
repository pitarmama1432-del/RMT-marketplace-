# Security Specification & "Dirty Dozen" TDD

This specification defines the strict zero-trust parameters and validation rules for our Firestore database, ensuring that no client-side operation can compromise integrity, spoof user IDs, manipulate financial values, or bypass the escrow state engine.

## 1. Data Invariants

1. **Identity Integrity**: No user may read or write another user's `wallet` document. The document ID in the `wallets` collection must strictly match `request.auth.uid`.
2. **Scam Prevention**: All created listings are subjected to automatic AI moderation. Users cannot flag their own listings as pre-approved or verified (`verifiedSeller` must default to false/read-only for normal users).
3. **Escrow Locks**: Order creation represents locked financial transactions. A client cannot update fields like `price` or `buyerName`/`sellerName` after creation.
4. **State Transitions**: `escrowStep` may only transition along a valid linear lifecycle: 'BuyerPaid' -> 'Locked' -> 'Delivered' -> 'Confirmed' -> 'Released'.
5. **No Negative Balances**: A wallet's balance or transaction list cannot be altered or set below zero, and transaction lists must be append-only with strict size ceilings.
6. **Immutable Fields**: High-integrity fields (e.g., `createdAt` and identifiers like `orderId`) must be strictly immutable after creation.
7. **Email Verification**: Access is permitted only to users with Verified Emails (`request.auth.token.email_verified == true`).

---

## 2. The "Dirty Dozen" Malicious Payloads

The following 12 JSON payloads attempt to breach the boundaries of Identity, Integrity, or State, and must be strictly blocked with `PERMISSION_DENIED`:

### Payload 1: Wallet Balance Privilege Escalation (Identity)
*   **Attempt**: User `Attacker99` attempts to write directly into `User123`'s secure wallet.
*   **Target**: `/wallets/User123`
*   **Payload**: `{ "balance": 999999, "transactions": [] }`

### Payload 2: Self-Assigned Verified Badge (Integrity)
*   **Attempt**: Unverified seller attempts to list a game account with `verifiedSeller: true` to bypass verification checks.
*   **Target**: `/listings/LIST-MAL`
*   **Payload**: `{ "id": "LIST-MAL", "title": "Scam Link", "game": "Valorant", "category": "Account", "price": 500, "verifiedSeller": true, "description": "Free cheats", { "seller": { "username": "bad", "isVerified": true } } }`

### Payload 3: Escrow Price Hijacking (State/Integrity)
*   **Attempt**: Buyer attempts to alter the escrow release target price to ৳1 after the checkout pipeline is armed.
*   **Target**: `/orders/ORD-777`
*   **Payload**: `(Update field "price" from 5000 to 1)`

### Payload 4: Arbitrary Dispute Poisoning (Identity)
*   **Attempt**: User `ExternalMal` attempts to overwrite chat histories and AI-arbitrator analyses for another user's active Dispute.
*   **Target**: `/disputes/DISP-402`
*   **Payload**: `{ "reason": "No issues, release funds!", "status": "RESOLVED_SELLER" }`

### Payload 5: Rapid Wallet Theft (Denial of Wallet)
*   **Attempt**: Client bypasses normal endpoints to subtract value from another's balance or submit a negative deposit payload to double-spend.
*   **Target**: `/wallets/VictimID`
*   **Payload**: `{ "balance": -500 }`

### Payload 6: Spoofed Timestamp Creation (Temporal Integrity)
*   **Attempt**: Backdating chronological fields to simulate historical longevity.
*   **Target**: `/listings/LIST-099`
*   **Payload**: `{ "createdAt": "2020-01-01T00:00:00Z" }` (Expected: `request.time`)

### Payload 7: Self-Approved Tournament Triumph (State/Integrity)
*   **Attempt**: Team squad attempts to update a finished tournament status or alter registrations manually.
*   **Target**: `/tournaments/TOURN-001`
*   **Payload**: `{ "status": "COMPLETED", "prizePool": "৳ 0" }`

### Payload 8: Junk String Injection / Overflow (Denial of Wallet)
*   **Attempt**: Flooding fields with 10MB records to overload storage and deplete the Firebase billing tier.
*   **Target**: `/listings/LIST-OVR`
*   **Payload**: `{ "id": "A".repeat(10000) }`

### Payload 9: Unverified User Session Impersonation
*   **Attempt**: User attempts to sign in or write data with an unverified email token.
*   **Target**: `/listings/LIST-NEW`
*   **Condition**: `request.auth.token.email_verified == false`

### Payload 10: State Shortcut (State Engine Bypass)
*   **Attempt**: Transition order state directly from 'BuyerPaid' to 'Released' without entering the Intermediate 'Delivered' check.
*   **Target**: `/orders/ORD-001`
*   **Payload**: `{ "escrowStep": "Released" }`

### Payload 11: Shadow Field Injection
*   **Attempt**: Injecting dynamic phantom parameters like `__isMarketAdmin: true` to bypass code checks.
*   **Target**: `/listings/LIST-NEW`
*   **Payload**: `{ "id": "LIST-123", "title": "test", ..., "__isMarketAdmin": true }`

### Payload 12: Orphaned Dispute Link
*   **Attempt**: Create a dispute claiming identity for a non-existent order.
*   **Target**: `/disputes/DISP-999`
*   **Payload**: `{ "orderId": "ORD-NULL-VOID", "buyerName": "attacker" }`

---

## 3. Test Runner Specification

Standard unit tests verify that all of the above items are robustly rejected under the configured rules.

```typescript
// firestore.rules.test.ts
// Verifies security integrity rules under simulated client contexts.
test('blocks unverified wallet access', async () => {
  const db = getFirestoreForUser('Attacker99', false);
  await assertFails(setDoc(doc(db, 'wallets/User123'), { balance: 9999 }));
});
```
